import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { campaign_id, action } = await req.json();
    if (!campaign_id) throw new Error("campaign_id required");

    // Use service role for privileged operations
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get campaign
    const { data: campaign, error: campError } = await adminClient
      .from("campaigns")
      .select("*")
      .eq("id", campaign_id)
      .eq("user_id", user.id)
      .single();

    if (campError || !campaign) throw new Error("Campaign not found");

    if (action === "pause") {
      if (campaign.status !== "calling") throw new Error("Campaign is not running");
      await adminClient.from("campaigns").update({ status: "paused" }).eq("id", campaign_id);
      return new Response(JSON.stringify({ success: true, status: "paused" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "resume" || action === "start") {
      const validStartStatuses = ["draft", "pending", "paused"];
      if (!validStartStatuses.includes(campaign.status)) {
        throw new Error(`Cannot start campaign in ${campaign.status} status`);
      }

      // Count leads
      const { count: leadCount } = await adminClient
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", campaign_id)
        .eq("status", "pending");

      const totalLeads = leadCount ?? 0;
      if (totalLeads === 0) throw new Error("No pending leads in campaign");

      // Check credits
      const { data: creditData } = await adminClient
        .from("credits_balance")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      const balance = creditData?.balance ?? 0;
      if (balance < totalLeads) {
        throw new Error(`Insufficient credits. Need ${totalLeads}, have ${balance}`);
      }

      // Update campaign status
      await adminClient
        .from("campaigns")
        .update({ status: "calling", total_leads: totalLeads })
        .eq("id", campaign_id);

      // Get pending leads
      const { data: leads } = await adminClient
        .from("leads")
        .select("*")
        .eq("campaign_id", campaign_id)
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      // Process leads sequentially via n8n
      const n8nWebhookUrl = campaign.n8n_webhook_url;
      let processedCount = campaign.processed_leads || 0;

      if (leads && n8nWebhookUrl) {
        for (const lead of leads) {
          // Check if campaign was paused
          const { data: currentCampaign } = await adminClient
            .from("campaigns")
            .select("status")
            .eq("id", campaign_id)
            .single();

          if (currentCampaign?.status === "paused") break;

          // Deduct credit
          const { data: deducted } = await adminClient.rpc("deduct_credit", {
            p_user_id: user.id,
            p_campaign_id: campaign_id,
            p_description: `Call to ${lead.phone_number}`,
          });

          if (!deducted) {
            await adminClient.from("campaigns").update({ status: "failed" }).eq("id", campaign_id);
            throw new Error("Credit deduction failed");
          }

          // Update lead status
          await adminClient.from("leads").update({ status: "calling" }).eq("id", lead.id);

          // Trigger n8n webhook
          try {
            await fetch(n8nWebhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lead_id: lead.id,
                campaign_id: campaign_id,
                user_id: user.id,
                phone_number: lead.phone_number,
                lead_name: lead.name,
                lead_email: lead.email,
                metadata: lead.metadata,
              }),
            });
          } catch (e) {
            console.error("n8n webhook failed for lead:", lead.id, e);
          }

          processedCount++;
          await adminClient
            .from("campaigns")
            .update({ processed_leads: processedCount })
            .eq("id", campaign_id);
        }
      }

      // Check final status
      const { data: finalCampaign } = await adminClient
        .from("campaigns")
        .select("status")
        .eq("id", campaign_id)
        .single();

      if (finalCampaign?.status === "calling") {
        await adminClient.from("campaigns").update({ status: "completed" }).eq("id", campaign_id);
      }

      return new Response(JSON.stringify({ success: true, processed: processedCount }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action. Use start, pause, or resume");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

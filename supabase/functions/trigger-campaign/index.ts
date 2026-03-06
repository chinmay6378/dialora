import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TWILIO_ACCOUNT_SID = "AC14dc76615cb5f3d1aef30f23c3554326";
const TWILIO_FROM_NUMBER = "+18126904144";
const TWILIO_TWIML_URL = "https://darshan-narsingkar.app.n8n.cloud/webhook/twiml";

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

      // Get Twilio auth token
      const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
      if (!twilioAuthToken) {
        throw new Error("Twilio is not configured. Please contact support.");
      }

      // Build the status callback URL pointing to our edge function
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const statusCallbackUrl = `${supabaseUrl}/functions/v1/call-status-callback`;

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

      let processedCount = campaign.processed_leads || 0;

      if (leads && leads.length > 0) {
        for (const lead of leads) {
          // Check if campaign was paused
          const { data: currentCampaign } = await adminClient
            .from("campaigns")
            .select("status")
            .eq("id", campaign_id)
            .single();

          if (currentCampaign?.status === "paused") break;

          // Make Twilio call directly
          const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;
          const twilioAuth = btoa(`${TWILIO_ACCOUNT_SID}:${twilioAuthToken}`);

          const callBody = new URLSearchParams({
            To: `+91${lead.phone_number}`,
            From: TWILIO_FROM_NUMBER,
            Url: TWILIO_TWIML_URL,
            Method: "POST",
            StatusCallback: statusCallbackUrl,
            StatusCallbackEvent: "completed",
            StatusCallbackMethod: "POST",
          });

          // Include metadata for status callback
          callBody.append("StatusCallbackEvent", "initiated");
          callBody.append("StatusCallbackEvent", "ringing");
          callBody.append("StatusCallbackEvent", "answered");

          try {
            const twilioResponse = await fetch(twilioUrl, {
              method: "POST",
              headers: {
                "Authorization": `Basic ${twilioAuth}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: callBody.toString(),
            });

            const twilioResult = await twilioResponse.json();

            if (!twilioResponse.ok) {
              console.error("Twilio API error for lead:", lead.id, twilioResult);
              await adminClient.from("leads").update({ status: "failed" }).eq("id", lead.id);

              // Insert failed call result
              await adminClient.from("call_results").insert({
                user_id: user.id,
                campaign_id: campaign_id,
                lead_id: lead.id,
                status: "failed",
                notes: `Twilio error: ${twilioResult.message || "Unknown error"}`,
              });

              processedCount++;
              await adminClient
                .from("campaigns")
                .update({ processed_leads: processedCount })
                .eq("id", campaign_id);
              continue;
            }

            // Deduct credit after successful call initiation
            const { data: deducted } = await adminClient.rpc("deduct_credit", {
              p_user_id: user.id,
              p_campaign_id: campaign_id,
              p_description: `Call to +91${lead.phone_number}`,
            });

            if (!deducted) {
              await adminClient.from("campaigns").update({ status: "failed" }).eq("id", campaign_id);
              throw new Error("Credit deduction failed");
            }

            // Update lead status and store call SID
            await adminClient
              .from("leads")
              .update({ status: "calling", metadata: { ...lead.metadata, call_sid: twilioResult.sid } })
              .eq("id", lead.id);

            // Insert initial call result with call SID
            await adminClient.from("call_results").insert({
              user_id: user.id,
              campaign_id: campaign_id,
              lead_id: lead.id,
              call_sid: twilioResult.sid,
              status: "initiated",
            });

          } catch (e) {
            console.error("Failed to call lead:", lead.id, e);
            await adminClient.from("leads").update({ status: "failed" }).eq("id", lead.id);
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
        const { count: remainingPending } = await adminClient
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("campaign_id", campaign_id)
          .eq("status", "pending");

        await adminClient
          .from("campaigns")
          .update({ status: (remainingPending ?? 0) > 0 ? "pending" : "completed" })
          .eq("id", campaign_id);
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

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

    const { campaign_id, leads } = await req.json();
    if (!campaign_id || !leads || !Array.isArray(leads)) {
      throw new Error("campaign_id and leads array required");
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify campaign ownership
    const { data: campaign } = await adminClient
      .from("campaigns")
      .select("id")
      .eq("id", campaign_id)
      .eq("user_id", user.id)
      .single();

    if (!campaign) throw new Error("Campaign not found");

    const records = leads.map((lead: any) => ({
      user_id: user.id,
      campaign_id,
      name: lead.name || null,
      phone_number: lead.phone_number || lead.phone || lead.Phone || "",
      email: lead.email || lead.Email || null,
      metadata: lead.metadata || {},
      status: "pending" as const,
    }));

    const { error: insertError } = await adminClient.from("leads").insert(records);
    if (insertError) throw new Error(insertError.message);

    // Update campaign total_leads
    const { count } = await adminClient
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("campaign_id", campaign_id);

    await adminClient
      .from("campaigns")
      .update({ total_leads: count ?? 0 })
      .eq("id", campaign_id);

    return new Response(JSON.stringify({ success: true, inserted: records.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

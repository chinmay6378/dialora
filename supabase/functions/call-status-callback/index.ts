import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { lead_id, campaign_id, user_id, call_sid, duration, status, recording_url, transcript, sentiment, notes } = body;

    if (!lead_id || !campaign_id || !user_id) {
      throw new Error("lead_id, campaign_id, and user_id are required");
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert call result
    await adminClient.from("call_results").insert({
      user_id,
      campaign_id,
      lead_id,
      call_sid: call_sid || null,
      duration: duration || 0,
      status: status || "completed",
      recording_url: recording_url || null,
      transcript: transcript || null,
      sentiment: sentiment || null,
      notes: notes || null,
    });

    // Update lead status
    const leadStatus = status === "failed" ? "failed" : "completed";
    await adminClient.from("leads").update({ status: leadStatus }).eq("id", lead_id);

    return new Response(JSON.stringify({ success: true }), {
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

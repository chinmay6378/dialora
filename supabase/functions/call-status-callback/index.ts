import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Twilio sends status callbacks as application/x-www-form-urlencoded
    const contentType = req.headers.get("content-type") || "";
    let body: Record<string, string>;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.text();
      body = Object.fromEntries(new URLSearchParams(formData));
    } else {
      body = await req.json();
    }

    const callSid = body.CallSid || body.call_sid;
    const callStatus = body.CallStatus || body.status;
    const callDuration = body.CallDuration || body.duration;
    const recordingUrl = body.RecordingUrl || body.recording_url;

    if (!callSid) {
      throw new Error("CallSid is required");
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find the call result by call_sid
    const { data: existingResult } = await adminClient
      .from("call_results")
      .select("*")
      .eq("call_sid", callSid)
      .single();

    if (existingResult) {
      // Map Twilio status to our status
      let mappedStatus = callStatus || existingResult.status;
      if (callStatus === "completed") mappedStatus = "completed";
      else if (callStatus === "busy" || callStatus === "no-answer" || callStatus === "failed" || callStatus === "canceled") {
        mappedStatus = "failed";
      }

      // Update call result
      await adminClient
        .from("call_results")
        .update({
          status: mappedStatus,
          duration: callDuration ? parseInt(callDuration) : existingResult.duration,
          recording_url: recordingUrl || existingResult.recording_url,
        })
        .eq("id", existingResult.id);

      // Update lead status
      const leadStatus = mappedStatus === "failed" ? "failed" : mappedStatus === "completed" ? "completed" : "calling";
      await adminClient
        .from("leads")
        .update({ status: leadStatus })
        .eq("id", existingResult.lead_id);

      // If this was a terminal status, check if campaign is done
      if (["completed", "failed"].includes(mappedStatus)) {
        const { count: pendingOrCalling } = await adminClient
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("campaign_id", existingResult.campaign_id)
          .in("status", ["pending", "calling"]);

        if ((pendingOrCalling ?? 0) === 0) {
          await adminClient
            .from("campaigns")
            .update({ status: "completed" })
            .eq("id", existingResult.campaign_id);
        }
      }
    } else {
      console.error("No call result found for CallSid:", callSid);
    }

    // Twilio expects 200 with empty body or TwiML
    return new Response("<Response/>", {
      headers: { ...corsHeaders, "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("call-status-callback error:", error);
    return new Response("<Response/>", {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "text/xml" },
    });
  }
});

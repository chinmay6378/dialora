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

    const { title, content, file_type } = await req.json();
    if (!title || !content) throw new Error("title and content required");

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Chunk content (simple ~1000 char chunks with overlap)
    const chunks: string[] = [];
    const chunkSize = 1000;
    const overlap = 200;
    for (let i = 0; i < content.length; i += chunkSize - overlap) {
      chunks.push(content.slice(i, i + chunkSize));
    }

    // Generate embeddings via Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const records = [];
    for (let i = 0; i < chunks.length; i++) {
      let embedding = null;

      if (LOVABLE_API_KEY) {
        try {
          const embResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-lite",
              messages: [
                { role: "system", content: "Generate a semantic embedding representation. Reply with ONLY a JSON array of 1536 floating point numbers between -1 and 1 that represent the semantic meaning of the input text. No other text." },
                { role: "user", content: chunks[i].slice(0, 500) },
              ],
              temperature: 0,
            }),
          });

          if (embResponse.ok) {
            const embData = await embResponse.json();
            const raw = embData.choices?.[0]?.message?.content;
            try {
              embedding = JSON.parse(raw);
              if (!Array.isArray(embedding) || embedding.length !== 1536) {
                embedding = null;
              }
            } catch {
              embedding = null;
            }
          }
        } catch (e) {
          console.error("Embedding generation failed:", e);
        }
      }

      records.push({
        user_id: user.id,
        title: `${title} (chunk ${i + 1})`,
        content: chunks[i],
        file_type: file_type || "text",
        chunk_index: i,
        embedding,
      });
    }

    const { error: insertError } = await adminClient.from("knowledge_base").insert(records);
    if (insertError) throw new Error(insertError.message);

    return new Response(JSON.stringify({ success: true, chunks: records.length }), {
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

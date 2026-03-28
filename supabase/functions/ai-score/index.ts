import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { athlete } = await req.json();
    if (!athlete) {
      return new Response(JSON.stringify({ error: "athlete data required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an AI sports analyst for FundMyGame. Analyze athlete data and return a JSON object with these scores and explanations. Be fair but highlight potential. Return ONLY a valid JSON object, no markdown.`
          },
          {
            role: "user",
            content: `Analyze this athlete and return scores:
Name: ${athlete.name}
Sport: ${athlete.sport}
Location: ${athlete.city}, ${athlete.state}
Age: ${athlete.age}
Achievements: ${JSON.stringify(athlete.achievements)}
Stats: ${JSON.stringify(athlete.stats)}
Bio: ${athlete.bio}
Funds received: ₹${athlete.fundsReceived}
Funding goal: ₹${athlete.fundingGoal}

Return JSON with: athleteScore (0-100), underdogScore (0-100), trendingScore (0-100), impactScore (0-100), growthPrediction (0-50 percent), sponsorshipPitch (2-3 sentence compelling pitch), explanation (brief analysis)`
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_scores",
            description: "Return athlete AI scores",
            parameters: {
              type: "object",
              properties: {
                athleteScore: { type: "number" },
                underdogScore: { type: "number" },
                trendingScore: { type: "number" },
                impactScore: { type: "number" },
                growthPrediction: { type: "number" },
                sponsorshipPitch: { type: "string" },
                explanation: { type: "string" },
              },
              required: ["athleteScore", "underdogScore", "trendingScore", "impactScore", "growthPrediction", "sponsorshipPitch", "explanation"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_scores" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      const scores = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(scores), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("score error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

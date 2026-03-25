import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, getModelSpecificTips } from "@/lib/prompts";
import { GenerationType, ImageModel, VideoModel } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { idea, generationType, model } = (await request.json()) as {
      idea: string;
      generationType: GenerationType;
      model: ImageModel | VideoModel;
    };

    if (!idea || !generationType || !model) {
      return NextResponse.json(
        { error: "idea, generationType, and model are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const modelTips = getModelSpecificTips(generationType, model);

    const userPrompt = `Generate optimized prompts for the following concept:

Concept: ${idea}
Generation Type: ${generationType}
Target Model: ${model}

${modelTips ? `Model-specific tips: ${modelTips}` : ""}

Please generate the prompts in all three formats (text, json, midjourney). Return ONLY valid JSON with "text", "json", and "midjourney" keys. Do not include any other text outside the JSON.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: buildSystemPrompt("generate"),
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Anthropic API error:", errorData);
      return NextResponse.json(
        { error: "AI service error" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Parse the JSON from the response
    let prompt;
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        prompt = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // If parsing fails, create a structured response from the raw text
      prompt = {
        text: text,
        json: { raw_prompt: text },
        midjourney: text.split("\n")[0] || text,
      };
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Generate prompt API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
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

    // Determine if this involves image analysis
    const hasImage = messages.some(
      (m: { imageUrl?: string }) => m.imageUrl
    );
    const mode = hasImage ? "extract" : "brainstorm";

    // Build the API messages
    const apiMessages = messages.map(
      (m: { role: string; content: string; imageUrl?: string }) => {
        if (m.imageUrl && m.role === "user") {
          // Multi-modal message with image
          const base64Match = m.imageUrl.match(
            /^data:image\/(\w+);base64,(.+)$/
          );
          if (base64Match) {
            return {
              role: m.role,
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: `image/${base64Match[1]}`,
                    data: base64Match[2],
                  },
                },
                {
                  type: "text",
                  text:
                    m.content ||
                    "Please analyze this image and create a detailed prompt that would reproduce it.",
                },
              ],
            };
          }
        }
        return { role: m.role, content: m.content };
      }
    );

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
        system: buildSystemPrompt(mode),
        messages: apiMessages,
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
    const message =
      data.content?.[0]?.text || "Sorry, I could not generate a response.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

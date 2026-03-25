"use client";

import { useState } from "react";
import {
  GenerationType,
  ImageModel,
  VideoModel,
  PromptOutput,
} from "@/types";
import Button from "@/components/ui/Button";

const imageModels: ImageModel[] = [
  "midjourney",
  "dall-e",
  "stable-diffusion",
  "flux",
  "ideogram",
];

const videoModels: VideoModel[] = [
  "runway",
  "pika",
  "kling",
  "sora",
  "luma",
];

export default function PromptGenerator() {
  const [generationType, setGenerationType] = useState<GenerationType>("image");
  const [selectedModel, setSelectedModel] = useState<ImageModel | VideoModel>(
    "midjourney"
  );
  const [idea, setIdea] = useState("");
  const [output, setOutput] = useState<PromptOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "json" | "midjourney">(
    "text"
  );
  const [copied, setCopied] = useState(false);

  const models = generationType === "image" ? imageModels : videoModels;

  async function handleGenerate() {
    if (!idea.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          generationType,
          model: selectedModel,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const data = await response.json();
      setOutput(data.prompt);
    } catch {
      setOutput({
        text: "Error generating prompt. Please check your API configuration and try again.",
        json: { error: "Generation failed" },
        midjourney: "Error generating prompt.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getOutputText(): string {
    if (!output) return "";
    if (activeTab === "json") return JSON.stringify(output.json, null, 2);
    if (activeTab === "midjourney") return output.midjourney;
    return output.text;
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Input Panel */}
      <div className="flex flex-col border-b border-border p-6 lg:w-1/2 lg:border-b-0 lg:border-r">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Generate Prompt
        </h2>

        {/* Generation Type Toggle */}
        <div className="mb-4">
          <label className="mb-2 block text-sm text-text-secondary">
            Generation Type
          </label>
          <div className="flex gap-2">
            {(["image", "video"] as GenerationType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setGenerationType(type);
                  setSelectedModel(type === "image" ? "midjourney" : "runway");
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  generationType === type
                    ? "bg-primary text-white"
                    : "bg-surface-light text-text-secondary hover:text-text-primary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Model Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm text-text-secondary">
            Target Model
          </label>
          <div className="flex flex-wrap gap-2">
            {models.map((model) => (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  selectedModel === model
                    ? "bg-primary/20 text-primary-light border border-primary"
                    : "bg-surface-light text-text-secondary border border-border hover:text-text-primary"
                }`}
              >
                {model.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Idea Input */}
        <div className="mb-4 flex-1">
          <label className="mb-2 block text-sm text-text-secondary">
            Your Idea
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe what you want to create... e.g., 'A cyberpunk samurai standing on a neon-lit rooftop at night'"
            className="h-full min-h-[120px] w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary-light focus:outline-none"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!idea.trim() || isGenerating}
          size="lg"
          className="w-full"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Prompts"
          )}
        </Button>
      </div>

      {/* Output Panel */}
      <div className="flex flex-col p-6 lg:w-1/2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Output</h2>
          {output && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(getOutputText())}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
        </div>

        {/* Output Format Tabs */}
        <div className="mb-4 flex gap-1 rounded-lg bg-surface p-1">
          {(["text", "json", "midjourney"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-surface-lighter text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab === "midjourney" ? "Midjourney" : tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Output Display */}
        <div className="flex-1 rounded-lg border border-border bg-surface p-4">
          {output ? (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary font-mono">
              {getOutputText()}
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center text-text-secondary">
              <p className="text-center text-sm">
                Enter your idea and click Generate to see prompts in all
                formats.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

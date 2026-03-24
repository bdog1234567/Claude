"use client";

import { useState } from "react";
import DashboardNav from "@/components/layout/DashboardNav";
import ChatInterface from "@/components/chat/ChatInterface";
import PromptGenerator from "@/components/prompt/PromptGenerator";

type Tab = "chat" | "generate";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  return (
    <div className="flex h-screen flex-col">
      <DashboardNav />

      {/* Tab Bar */}
      <div className="mt-16 border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-1">
            {[
              { id: "chat" as Tab, label: "Brainstorm", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
              { id: "generate" as Tab, label: "Generate Prompts", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary-light"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={tab.icon}
                  />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto h-full max-w-7xl">
          {activeTab === "chat" ? <ChatInterface /> : <PromptGenerator />}
        </div>
      </div>
    </div>
  );
}

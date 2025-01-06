import Anthropic from "@anthropic-ai/sdk";
import { loadSettings } from "./store";
import * as fs from "fs";
import * as path from "path";
import { app } from "electron";

let anthropicClient: Anthropic | null = null;
let systemPromptContent: string | null = null;

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function initializeAnthropicClient() {
  const settings = loadSettings();
  if (settings.anthropicApiKey) {
    anthropicClient = new Anthropic({
      apiKey: settings.anthropicApiKey,
    });

    try {
      let promptPath;
      if (app.isPackaged) {
        // Production: use resources path
        promptPath = path.join(process.resourcesPath, "prompts", "system_prompt.md");
      } else {
        // Development: use source directory
        promptPath = path.join(__dirname, "prompts", "system_prompt.md");
      }

      systemPromptContent = fs.readFileSync(promptPath, "utf-8");
      console.log("System prompt loaded successfully from:", promptPath);
    } catch (error) {
      console.error("Error loading system prompt:", error);
      systemPromptContent = null;
    }
  }
  return !!anthropicClient;
}

export async function sendMessage(messages: Message[]): Promise<string> {
  if (!anthropicClient) {
    const initialized = initializeAnthropicClient();
    if (!initialized) {
      throw new Error("Please set your Anthropic API key in settings");
    }
  }

  try {
    const response = await anthropicClient!.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4096,
      system: systemPromptContent || undefined,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("Unexpected response format from Anthropic API");
    }

    return textContent.text;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

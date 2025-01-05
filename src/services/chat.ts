import Anthropic from '@anthropic-ai/sdk';
const { ipcRenderer } = window.require('electron');

let anthropicClient: Anthropic | null = null;

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function initializeAnthropicClient(): Promise<boolean> {
  return await ipcRenderer.invoke('initialize-anthropic');
}

export async function sendMessage(messages: Message[]): Promise<string> {
  return await ipcRenderer.invoke('send-message', messages);
}

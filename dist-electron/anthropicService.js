"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAnthropicClient = initializeAnthropicClient;
exports.sendMessage = sendMessage;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const store_1 = require("./store");
let anthropicClient = null;
function initializeAnthropicClient() {
    const settings = (0, store_1.loadSettings)();
    if (settings.anthropicApiKey) {
        anthropicClient = new sdk_1.default({
            apiKey: settings.anthropicApiKey,
        });
    }
    return !!anthropicClient;
}
async function sendMessage(messages) {
    if (!anthropicClient) {
        const initialized = initializeAnthropicClient();
        if (!initialized) {
            throw new Error('Please set your Anthropic API key in settings');
        }
    }
    try {
        const response = await anthropicClient.messages.create({
            model: 'claude-3-opus-20240229',
            max_tokens: 4096,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
        });
        const textContent = response.content.find(block => block.type === 'text');
        if (!textContent || textContent.type !== 'text') {
            throw new Error('Unexpected response format from Anthropic API');
        }
        return textContent.text;
    }
    catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}
//# sourceMappingURL=anthropicService.js.map


import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters } from "@google/genai";
import { GEMINI_TEXT_MODEL, GEMINI_API_KEY, DEFAULT_ERROR_MESSAGE, GEMINI_THINKING_BUDGET_LOW_LATENCY } from '../constants';

// Validate API key at module load
if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is required. Please set VITE_GEMINI_API_KEY in your .env.local file.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface GenerateTextConfig {
    systemInstruction?: string;
    topK?: number;
    topP?: number;
    temperature?: number;
    responseMimeType?: "text/plain" | "application/json";
    seed?: number;
    disableThinking?: boolean; // Convenience flag for thinkingBudget
}

const parseJsonFromGeminiResponse = <T,>(jsonString: string): T | null => {
    let cleanedString = jsonString.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Matches ```json ... ``` or ``` ... ```
    const match = cleanedString.match(fenceRegex);
    if (match && match[2]) {
        cleanedString = match[2].trim(); // Extract content within fences
    }
    try {
        return JSON.parse(cleanedString) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", cleanedString, e);
        // It might be useful to throw a specific error or return a structured error object here
        return null;
    }
};


const generateText = async (
    prompt: string,
    config?: GenerateTextConfig
): Promise<string> => {
    try {
        const fullConfig: Partial<GenerateContentParameters['config']> = {};
        if (config?.systemInstruction) fullConfig.systemInstruction = config.systemInstruction;
        if (config?.topK) fullConfig.topK = config.topK;
        if (config?.topP) fullConfig.topP = config.topP;
        if (config?.temperature) fullConfig.temperature = config.temperature;
        if (config?.responseMimeType) fullConfig.responseMimeType = config.responseMimeType;
        if (config?.seed) fullConfig.seed = config.seed;

        // Apply thinkingConfig only if disableThinking is true AND model is compatible
        if (config?.disableThinking && GEMINI_TEXT_MODEL === "gemini-2.5-flash") {
            fullConfig.thinkingConfig = { thinkingBudget: GEMINI_THINKING_BUDGET_LOW_LATENCY };
        } else if (config?.disableThinking) {
            console.warn(`Thinking config (disableThinking) is only applicable to 'gemini-2.5-flash'. Current model: ${GEMINI_TEXT_MODEL}. It will be ignored.`);
        }

        const requestParams: GenerateContentParameters = {
            model: GEMINI_TEXT_MODEL,
            contents: prompt,
        };

        if (Object.keys(fullConfig).length > 0) {
            requestParams.config = fullConfig;
        }

        const response: GenerateContentResponse = await ai.models.generateContent(requestParams);

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Consider more specific error handling based on error type if needed
        throw new Error(DEFAULT_ERROR_MESSAGE);
    }
};


// Example specific functions (can be expanded)
const generateRouteOptimizationSummary = async (origin: string, destination: string): Promise<string> => {
    const prompt = `Generate a concise route optimization summary for a truck going from ${origin} to ${destination}. Mention key roads, potential challenges, and estimated travel time.`;
    return generateText(prompt, { disableThinking: true }); // Low latency for route summary
};

const generateRiskAlertText = async (scenario: string): Promise<string> => {
    const prompt = `Analyze the following risk scenario for a cargo shipment and provide a brief alert text (max 3 sentences): "${scenario}"`;
    return generateText(prompt, { systemInstruction: "You are a logistics risk assessment AI." });
};

export const geminiService = {
    generateText,
    parseJsonFromGeminiResponse, // Export the parser utility
    generateRouteOptimizationSummary,
    generateRiskAlertText,
};
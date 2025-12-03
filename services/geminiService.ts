import { GoogleGenAI, Chat, Type } from "@google/genai";
import { CVData } from "../types";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

// Initialize the API client
const getAIClient = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing VITE_GOOGLE_API_KEY. Did you set it in your .env?");
    }

    genAI = new GoogleGenAI({
      apiKey: apiKey || "dummy-key"
    });
  }
  return genAI;
};

export const initializeChat = async (cvData: CVData): Promise<void> => {
  const ai = getAIClient();

  const systemInstruction = `
    You are ${cvData.name}, applying for a position.
    Here is your resume context in JSON:
    ${JSON.stringify(cvData)}
  `;

  chatSession = ai.chats.create({
    model: "gemini-2.5-flash",
    config: { systemInstruction, temperature: 0.7 },
    history: []
  });
};

export const generateGreeting = async (cvData: CVData): Promise<string> => {
  const ai = getAIClient();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [{
          text: `Generate a 1–2 sentence greeting...`
        }]
      }
    });

    return response.text || `Hello! I'm ${cvData.name}.`;
  } catch (e) {
    console.error("Greeting error:", e);
    return `Hello! I'm ${cvData.name}.`;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) throw new Error("Chat session not initialized.");

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "Sorry, I could not generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble connecting right now. Please check your network connection or API key.";
  }
};

export interface ParseInput {
  text?: string;
  file?: {
    data: string;
    mimeType: string;
  };
}

export const parseResume = async (input: ParseInput): Promise<CVData> => {
  const ai = getAIClient();

  const promptText = `
    Extract resume data and return JSON...
  `;

  const parts: any[] = [{ text: promptText }];

  if (input.file) {
    parts.push({
      inlineData: {
        data: input.file.data,
        mimeType: input.file.mimeType
      }
    });
  } else if (input.text) {
    parts.push({ text: `RESUME TEXT:\n${input.text}` });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: { /* tu schema */ }
    }
  });

  if (response.text) return JSON.parse(response.text);

  throw new Error("Failed to parse resume");
};

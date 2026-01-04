import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole, NSFC_SYSTEM_INSTRUCTION } from "../types";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initializeGemini = (apiKey: string) => {
  ai = new GoogleGenAI({ apiKey });
};

export const startChatSession = async (initialContext: string): Promise<string> => {
  if (!ai) throw new Error("Gemini API not initialized");

  // Create a chat session with the specialized persona
  // Using gemini-3-pro-preview for complex text tasks (Academic Analysis)
  chatSession = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: NSFC_SYSTEM_INSTRUCTION,
      temperature: 0.7, 
    }
  });

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: `[System Injection: Documents Uploaded]
      
      The user has provided the following text content from their reference papers. 
      Please perform Step 1 (Reviewer's Scan) immediately based on these texts.
      
      --- BEGIN PAPERS ---
      ${initialContext}
      --- END PAPERS ---
      
      Start your analysis now.`
    });

    return response.text || "Error: No response text generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const sendChatMessage = async (userMessage: string): Promise<string> => {
  if (!chatSession) throw new Error("Chat session not started");

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: userMessage
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
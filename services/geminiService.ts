import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

// Initialize the client using process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToNexus = async (
  userMessage: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  
  try {
    const model = 'gemini-3-flash-preview'; 
    
    // Construct the chat history for context
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
      history: history
    });

    const result = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "Connection interrupted. The Neural Nexus is recalibrating...";
  } catch (error) {
    console.error("Neural Nexus Error:", error);
    return "Error connecting to the Neural Nexus. Please try again later.";
  }
};
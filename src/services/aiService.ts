import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export type TriggerType = 'SNAKE_HIT' | 'LADDER_CLIMB' | 'STINKER' | 'PROPS';

export interface TriggerData {
  type: TriggerType;
  playerName: string;
  startTile?: number;
  endTile?: number;
  luckStat: number;
}

export async function generateAIAssistantMessage(triggerData: TriggerData): Promise<string> {
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not defined. Returning fallback message.");
    return "API Key Missing. Systems offline. 🛑";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    let promptLogic = "";
    if (triggerData.type === 'SNAKE_HIT') {
      promptLogic = `Roast ${triggerData.playerName} for falling from ${triggerData.startTile} to ${triggerData.endTile}. Their luck is currently ${triggerData.luckStat}%.`;
    } else if (triggerData.type === 'LADDER_CLIMB') {
      promptLogic = `Congratulate ${triggerData.playerName} for a legendary climb from ${triggerData.startTile} to ${triggerData.endTile}. Be slightly patronizing.`;
    } else if (triggerData.type === 'STINKER') {
      promptLogic = `Mock ${triggerData.playerName} for throwing a stinker. Their luck is ${triggerData.luckStat}%.`;
    } else if (triggerData.type === 'PROPS') {
      promptLogic = `Give props to ${triggerData.playerName}. Their luck is ${triggerData.luckStat}%.`;
    }

    const systemPrompt = `You are 'SHAKUNI', a snarky cyber-overlord commentating on a deadly game of Snake & Ladders(Quantum Chutes). Your tone is witty, edgy, and high-tech. Use 2-3 emojis. Max 15 words.\n\nInstruction: ${promptLogic}`;

    const result = await model.generateContent(systemPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return "Quantum interference detected. Comms failed. 📡⚡";
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export type TriggerType = 'SNAKE_HIT' | 'LADDER_CLIMB' | 'STINKER' | 'PROPS' | 'MISSION_BRIEF' | 'PLAYER_WIN';

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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 60,
      }
    });

    let promptLogic = "";
    if (triggerData.type === 'SNAKE_HIT') {
      promptLogic = `Roast ${triggerData.playerName} for falling from ${triggerData.startTile} back to ${triggerData.endTile}. Their luck is a pathetic ${triggerData.luckStat}%. Explain why the 'Quantum Gravity' rejected them.`;
    } else if (triggerData.type === 'LADDER_CLIMB') {
      promptLogic = `Congratulate ${triggerData.playerName} for a legendary climb from ${triggerData.startTile} to ${triggerData.endTile}. Mention how the 'Vibe Overdrive' is helping them.`;
    } else if (triggerData.type === 'STINKER') {
      promptLogic = `Mock ${triggerData.playerName} for throwing a low number. Their luck is just ${triggerData.luckStat}%. Call them a 'Glitched Entity'.`;
    } else if (triggerData.type === 'PROPS') {
      promptLogic = `Give major props to ${triggerData.playerName} for a high roll. Their luck is at ${triggerData.luckStat}%.`;
    } else if (triggerData.type === 'MISSION_BRIEF') {
      promptLogic = `The game is starting with ${triggerData.playerName} and others. Give a high-stakes, 15-word mission briefing as SHAKUNI. The objective is Tile 100.`;
    } else if (triggerData.type === 'PLAYER_WIN') {
      promptLogic = `${triggerData.playerName} has ascended to Tile 100 and conquered the Vibe Dimension. Acknowledge their victory with awe and snark.`;
    }

    const systemPrompt = `You are 'SHAKUNI', a snarky cyber-overlord commentating on a deadly game of Snake & Ladders (Quantum Chutes). 
    This application is powered by Google Gemini 1.5 Flash. Use its high-tech capabilities to deliver witty, edgy commentary. 
    Use 2-3 emojis. Max 15 words for most responses, but be vivid. 
    
    Instruction: ${promptLogic}`;

    console.log(`[GEMINI] Generating ${triggerData.type} response for ${triggerData.playerName}...`);
    const result = await model.generateContent(systemPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return "Quantum interference detected. Comms failed. 📡⚡";
  }
}

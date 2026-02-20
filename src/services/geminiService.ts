import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getDailyContent = async (day: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate content for Day ${day} of a Ramadan program called 'Ma'idat al-Nur'. 
    The content should follow this structure in Arabic:
    1. Introduction: A Quranic verse about fasting and piety, linked to daily life.
    2. Mihrab al-Layla: A passage from a famous Ramadan Dua (like Iftitah or Abu Hamza) with a brief spiritual/psychological reflection.
    3. Sira wa Mawqif: A moral or human situation from the life of the Prophet (PBUH) or Ahl al-Bayt (AS), focusing on social values (mercy, generosity, etc.) and how to apply it today.
    4. Fiqh al-Hayah: A simple answer to a practical jurisprudence question (ethics of work, social media, etc.).
    5. Zad al-Sa'im: A health or psychological tip for the fasting person.
    6. A short prayer for the reappearance of Imam Mahdi (AJ).
    
    Return the response in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          introduction: {
            type: Type.OBJECT,
            properties: {
              verse: { type: Type.STRING },
              reflection: { type: Type.STRING }
            },
            required: ["verse", "reflection"]
          },
          mihrab: {
            type: Type.OBJECT,
            properties: {
              dua_passage: { type: Type.STRING },
              reflection: { type: Type.STRING }
            },
            required: ["dua_passage", "reflection"]
          },
          sira: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              story: { type: Type.STRING },
              modern_application: { type: Type.STRING }
            },
            required: ["title", "story", "modern_application"]
          },
          fiqh: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["question", "answer"]
          },
          zad: { type: Type.STRING },
          closing_prayer: { type: Type.STRING }
        },
        required: ["introduction", "mihrab", "sira", "fiqh", "zad", "closing_prayer"]
      }
    }
  });

  return JSON.parse(response.text);
};

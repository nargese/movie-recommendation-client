import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCkD8ZhtnKUtSn2sLCo7dSAKWXTBJeO1s8",
});
const config = {
  responseMimeType: "text/plain",
};
const model = "gemini-2.0-flash";

export async function getAIRecommendation(prompt) {
  try {
    const response = await ai.models.generateContent({
      model,
      config,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("Error sending message: ", error);
    return null;
  }
}
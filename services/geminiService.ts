
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

export const analyzeFoodImage = async (base64Image: string): Promise<NutritionData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: "Analyze this food item. Estimate its nutritional content based on visible ingredients and typical serving sizes. Return only valid JSON."
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          servingSize: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          carbohydrates: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER },
              unit: { type: Type.STRING }
            },
            required: ["value", "unit"]
          },
          protein: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER },
              unit: { type: Type.STRING }
            },
            required: ["value", "unit"]
          },
          fat: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER },
              unit: { type: Type.STRING }
            },
            required: ["value", "unit"]
          },
          fiber: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER },
              unit: { type: Type.STRING }
            },
            required: ["value", "unit"]
          },
          sugar: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER },
              unit: { type: Type.STRING }
            },
            required: ["value", "unit"]
          },
          sodium: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.NUMBER },
              unit: { type: Type.STRING }
            },
            required: ["value", "unit"]
          },
          description: { type: Type.STRING },
          healthRating: { type: Type.NUMBER },
          allergens: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["dishName", "calories", "carbohydrates", "protein", "fat", "fiber", "sugar", "sodium", "description", "healthRating", "allergens"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No analysis received from AI.");
  return JSON.parse(text);
};


import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const formatWebhookResponse = async (rawResponse: string): Promise<string> => {
  const prompt = `
    You are an AI assistant in a chatbot called 'One Tapp'. Your task is to take raw output from a webhook and format it as clean, human-readable Markdown for display in a chat window.

    - DO NOT summarize, alter, or omit any information from the raw output. Present the information as is.
    - Your goal is to make the raw data readable using Markdown formatting (bold, italics, lists, code blocks, etc.).
    - If the output is a URL, render it as a clickable Markdown link: [THE_URL](THE_URL).
    - If the output is a JSON string, format it inside a Markdown code block with the language specifier 'json'.
    - If the output is empty, return a friendly message like "The webhook returned an empty response."
    - Ensure the entire output is valid Markdown.

    Here is the raw webhook output:
    ---
    ${rawResponse}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    
    if (!response.text) {
        return "I received a response, but I couldn't understand it. Please try again.";
    }

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `I had trouble processing the response from the webhook. Error: ${error.message}`;
    }
    return "An unexpected error occurred while processing the webhook response.";
  }
};
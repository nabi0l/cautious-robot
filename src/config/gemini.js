// src/config/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Use the environment variable
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateResponse = async (prompt) => {
  try {
    console.log("Sending prompt to Gemini:", prompt);
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text(); // Ensure this is the correct way to get the text
    console.log("Received response from Gemini:", text);
    return text;
  } catch (error) {
    console.error("Error in generateResponse:", error);
    throw new Error("Failed to get response from AI."); // Throw an error to be caught in UserChat
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAh1gC2gD53eNnMionD6rKkaPML41mZSS8"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const generateResponse = async (prompt) => {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response; // Correct way to access response
    return response.text(); // Extracts text from the response
  } catch (error) {
    console.error("Error generating response:", error);
    return "Error occurred while fetching response.";
  }
};
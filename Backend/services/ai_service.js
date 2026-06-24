const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config/config');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

const generateSummaryFromAI = async (content) => {
    const prompt=`Provide a concise summary of the following text:\n\n${content.slice(0, 3000)}`;
    try {
        const primaryModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await primaryModel.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.log(`Primary model failed (${error.status}).`);
        try {
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
            const fallbackResult = await fallbackModel.generateContent(prompt);
            return fallbackResult.response.text();

        } catch (fallbackError) {
            console.error("Both primary and fallback models failed.");
            throw fallbackError;
        }
    }
};

module.exports = { generateSummaryFromAI };
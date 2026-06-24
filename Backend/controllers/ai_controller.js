const { generateSummaryFromAI } = require("../services/ai_service");

const generateSummary = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const summary = await generateSummaryFromAI(content);

        res.status(200).json({ summary });

    } catch (error) {
        console.log("Gemini API error:", error);
        res.status(500).json({ message: "Failed to generate summary" });
    }
};

module.exports = { generateSummary }
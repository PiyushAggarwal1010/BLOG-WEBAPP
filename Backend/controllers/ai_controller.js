const { generateSummaryFromAI } = require("../services/ai_service");

const generateSummary = async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content) {
            const error = new Error("Content is Required");
            error.statusCode = 400;
            return next(error);
        }

        const summary = await generateSummaryFromAI(content);

        res.status(200).json({ summary });

    } catch (error) {
        next(error);
    }
};

module.exports = { generateSummary }
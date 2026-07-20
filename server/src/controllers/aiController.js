const { analyzeQuestion, analyzePortfolioAI } = require("../services/aiService");
const prisma = require("../utils/prisma");

const analyzeStock = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await analyzeQuestion(question);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
    });
  }
};

const analyzePortfolio = async (req, res) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: req.user.id,
      },
    });

    if (portfolios.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Portfolio is empty",
      });
    }

    const response = await analyzePortfolioAI(portfolios);

    return res.status(200).json({
      success: true,
      analysis: response,
    });
  } catch (error) {
    console.error("AI Portfolio Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeStock,
  analyzePortfolio,
};

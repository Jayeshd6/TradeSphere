const prisma = require("../utils/prisma");
const { getQuote } = require("../services/stockService");


const addPortfolio = async (req, res) => {
  try {
    const { symbol, companyName, quantity, buyPrice } = req.body;

    // Basic validation
    if (!symbol || !companyName || !quantity || !buyPrice) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create portfolio entry
    const portfolio = await prisma.portfolio.create({
      data: {
        userId: req.user.id,
        symbol,
        companyName,
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Investment added successfully",
      portfolio,
    });

  } catch (error) {
    console.error("Add Portfolio Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getPortfolios = async (req, res) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      portfolios,
    });
  } catch (error) {
    console.error("Get Portfolio Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const getLivePortfolio = async (req, res) => {
    try {

        // Fetch user's portfolio
        const portfolios = await prisma.portfolio.findMany({
            where: {
                userId: req.user.id,
            },
        });

        const livePortfolio = await Promise.all(

            portfolios.map(async (portfolio) => {

                const quote = await getQuote(portfolio.symbol);

                const currentPrice = quote.c;

                const invested =
                    portfolio.quantity * portfolio.buyPrice;

                const currentValue =
                    portfolio.quantity * currentPrice;

                const profit =
                    currentValue - invested;

                const profitPercent =
                    invested === 0
                        ? 0
                        : (profit / invested) * 100;

                return {
                    ...portfolio,

                    currentPrice,

                    invested,

                    currentValue,

                    profit,

                    profitPercent,
                };
            })

        );

        res.status(200).json({
            success: true,
            portfolio: livePortfolio,
        });

    } catch (error) {

        console.error("Live Portfolio Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch live portfolio",
        });

    }
};


module.exports = {
  addPortfolio,
  getPortfolios,
  getLivePortfolio
};
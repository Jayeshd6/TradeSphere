const prisma = require("../utils/prisma");
const { getQuote } = require("../services/stockService");

const addToWatchlist = async (req, res) => {
  try {
    const { symbol, companyName } = req.body;

    if (!symbol || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Symbol and company name are required",
      });
    }

    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_symbol: {
          userId: req.user.id,
          symbol: symbol.toUpperCase(),
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Stock already in watchlist",
      });
    }

    const stock = await prisma.watchlist.create({
      data: {
        userId: req.user.id,
        symbol: symbol.toUpperCase(),
        companyName,
      },
    });

    try {
      const { createNotification } = require("../services/notificationService");
      await createNotification({
        userId: req.user.id,
        title: "Added to Watchlist",
        message: `Added ${symbol.toUpperCase()} (${companyName}) to Watchlist.`,
        type: "WATCHLIST"
      });
    } catch (e) {
      console.error("Watchlist notification error:", e);
    }

    return res.status(201).json({
      success: true,
      message: "Added to watchlist",
      stock,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const watchlist = await prisma.watchlist.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const liveWatchlist = await Promise.all(
      watchlist.map(async (stock) => {
        let currentPrice = 0;
        let change = 0;
        let changePercent = 0;
        try {
          const quote = await getQuote(stock.symbol);
          if (quote) {
            currentPrice = quote.c || 0;
            change = quote.d || 0;
            changePercent = quote.dp || 0;
          }
        } catch (err) {
          console.warn(`Failed to fetch quote for watchlist item ${stock.symbol}:`, err.message);
        }

        return {
          ...stock,
          currentPrice,
          change,
          changePercent,
        };
      })
    );

    return res.json({
      success: true,
      watchlist: liveWatchlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;

    await prisma.watchlist.delete({
      where: {
        userId_symbol: {
          userId: req.user.id,
          symbol: symbol.toUpperCase(),
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Removed from watchlist",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};

const prisma = require("../utils/prisma");
const { getQuote } = require("../services/stockService");

// Add stock to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { symbol, companyName } = req.body;

    if (!symbol || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Symbol and company name are required",
      });
    }

    const cleanSymbol = symbol.toUpperCase();

    // Check if already in watchlist
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_symbol: {
          userId: req.user.id,
          symbol: cleanSymbol,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Stock is already in your watchlist",
      });
    }

    const item = await prisma.watchlist.create({
      data: {
        userId: req.user.id,
        symbol: cleanSymbol,
        companyName,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Added to watchlist successfully",
      watchlist: item,
    });
  } catch (error) {
    console.error("Add To Watchlist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add stock to watchlist",
    });
  }
};

// Remove stock from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Symbol is required",
      });
    }

    const cleanSymbol = symbol.toUpperCase();

    await prisma.watchlist.delete({
      where: {
        userId_symbol: {
          userId: req.user.id,
          symbol: cleanSymbol,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Removed from watchlist successfully",
    });
  } catch (error) {
    console.error("Remove From Watchlist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove stock from watchlist",
    });
  }
};

// Get all watchlisted stocks with live prices
const getWatchlist = async (req, res) => {
  try {
    const list = await prisma.watchlist.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Stitch live quotes for each stock
    const watchlistWithQuotes = await Promise.all(
      list.map(async (item) => {
        let price = 0;
        let changePercent = 0;

        try {
          const quote = await getQuote(item.symbol);
          if (quote) {
            price = quote.c || 0;
            changePercent = quote.dp || 0;
          }
        } catch (err) {
          console.warn(`Failed to fetch quote for watchlist item ${item.symbol}:`, err.message);
        }

        return {
          id: item.id,
          symbol: item.symbol,
          companyName: item.companyName,
          price,
          changePercent,
        };
      })
    );

    return res.status(200).json({
      success: true,
      watchlist: watchlistWithQuotes,
    });
  } catch (error) {
    console.error("Get Watchlist Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch watchlist",
    });
  }
};

module.exports = {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
};

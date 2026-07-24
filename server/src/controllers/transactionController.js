const prisma = require("../utils/prisma");
const { getQuote } = require("../services/stockService");
const { savePortfolioSnapshot } = require("../services/snapshotService");
const { createNotification } = require("../services/notificationService");

const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      transactions,
    });

  } catch (error) {
    console.error("Get Transactions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const buyStock = async (req, res) => {
  try {
    const {
      symbol,
      companyName,
      quantity,
      price,
    } = req.body;

    // 1. Validate input
    if (
      !symbol ||
      !companyName ||
      !quantity ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const stockQuantity = Number(quantity);
    const stockPrice = Number(price);

    // 2. Calculate total cost
    const total = stockQuantity * stockPrice;

    // 3. Get user's current wallet
    let wallet = await prisma.wallet.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    // If wallet doesn't exist, create it (backwards compatibility for legacy users)
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: req.user.id,
          balance: 1000000,
        },
      });
    }

    // 4. Check whether user has enough money
    if (wallet.balance < total) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // 5. Perform all database operations atomically
    const result = await prisma.$transaction(
      async (tx) => {

        // Find existing portfolio holding
        const existingPortfolio =
          await tx.portfolio.findUnique({
            where: {
              userId_symbol: {
                userId: req.user.id,
                symbol: symbol.toUpperCase(),
              },
            },
          });

        let portfolio;

        // 6. If stock already exists
        if (existingPortfolio) {

          const oldTotal =
            existingPortfolio.quantity *
            existingPortfolio.buyPrice;

          const newTotal =
            stockQuantity * stockPrice;

          const newQuantity =
            existingPortfolio.quantity +
            stockQuantity;

          const averagePrice =
            (oldTotal + newTotal) /
            newQuantity;

          portfolio =
            await tx.portfolio.update({
              where: {
                id: existingPortfolio.id,
              },
              data: {
                quantity: newQuantity,
                buyPrice: averagePrice,
              },
            });

        }

        // 7. If stock does not exist
        else {

          portfolio =
            await tx.portfolio.create({
              data: {
                userId: req.user.id,
                symbol: symbol.toUpperCase(),
                companyName,
                quantity: stockQuantity,
                buyPrice: stockPrice,
              },
            });

        }

        // 8. Create BUY transaction
        const transaction =
          await tx.transaction.create({
            data: {
              userId: req.user.id,
              symbol: symbol.toUpperCase(),
              type: "BUY",
              quantity: stockQuantity,
              price: stockPrice,
              total,
            },
          });

        // 9. Deduct money from wallet
        const updatedWallet =
          await tx.wallet.update({
            where: {
              userId: req.user.id,
            },
            data: {
              balance: {
                decrement: total,
              },
            },
          });

        return {
          portfolio,
          transaction,
          balance: updatedWallet.balance,
        };
      }
    );

    // 10. Send response
    await savePortfolioSnapshot(req.user.id);

    try {
      await createNotification({
        userId: req.user.id,
        title: "Stock Purchased",
        message: `Bought ${quantity} ${symbol.toUpperCase()} shares.`,
        type: "BUY"
      });
    } catch (e) {
      console.error("Buy Stock notification error:", e);
    }

    return res.status(201).json({
      success: true,
      message: "Stock bought successfully",
      data: result,
    });

  } catch (error) {

    console.error(
      "Buy Stock Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    if (
      !symbol ||
      !quantity ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid symbol and quantity are required",
      });
    }
    const quote = await getQuote(symbol.toUpperCase());
    const currentPrice = quote.c;

    if (!currentPrice || currentPrice <= 0) {
      throw new Error("Unable to fetch live stock price");
    }


    const result = await prisma.$transaction(async (tx) => {

      const portfolio =
        await tx.portfolio.findUnique({
          where: {
            userId_symbol: {
              userId: req.user.id,
              symbol: symbol.toUpperCase(),
            },
          },
        });

      // Stock does not exist
      if (!portfolio) {
        throw new Error("You do not own this stock");
      }

      // Cannot sell more than owned
      if (portfolio.quantity < Number(quantity)) {
        throw new Error(
          `You only own ${portfolio.quantity} shares`
        );
      }

      const remainingQuantity =
        portfolio.quantity - Number(quantity);

      let updatedPortfolio;

      if (remainingQuantity === 0) {

        updatedPortfolio =
          await tx.portfolio.delete({
            where: {
              id: portfolio.id,
            },
          });

      } else {

        updatedPortfolio =
          await tx.portfolio.update({
            where: {
              id: portfolio.id,
            },
            data: {
              quantity: remainingQuantity,
            },
          });

      }

      const transaction =
        await tx.transaction.create({
          data: {
            userId: req.user.id,
            symbol: symbol.toUpperCase(),
            type: "SELL",
            quantity: Number(quantity),
            price: currentPrice,
            total: Number(quantity) * currentPrice,
          },
        });
      const sellAmount =
        Number(quantity) * currentPrice;
      await tx.wallet.update({
        where: {
          userId: req.user.id,
        },
        data: {
          balance: {
            increment: sellAmount,
          },
        },
      });
      return {
        updatedPortfolio,
        transaction,
      };
    });

    await savePortfolioSnapshot(req.user.id);

    try {
      await createNotification({
        userId: req.user.id,
        title: "Stock Sold",
        message: `Sold ${quantity} ${symbol.toUpperCase()} shares.`,
        type: "SELL"
      });
    } catch (e) {
      console.error("Sell Stock notification error:", e);
    }

    return res.status(201).json({
      success: true,
      message: "Stock sold successfully",
      data: result,
    });

  } catch (error) {
    console.error("Sell Stock Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBalance = async (req, res) => {
  try {
    let wallet = await prisma.wallet.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: req.user.id,
          balance: 1000000,
        },
      });
    }

    return res.status(200).json({
      success: true,
      balance: wallet.balance,
    });

  } catch (error) {
    console.error("Get Balance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch balance",
    });
  }
};
module.exports = {
  getTransactions,
  buyStock,
  sellStock,
  getBalance,
};
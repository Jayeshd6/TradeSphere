const prisma = require("../utils/prisma");
const { getQuote } = require("./stockService");

const calculatePortfolioValue = async (userId) => {
  const portfolio = await prisma.portfolio.findMany({
    where: { userId },
  });

  let value = 0;

  for (const stock of portfolio) {
    let currentPrice = stock.buyPrice;
    try {
      const quote = await getQuote(stock.symbol);
      if (quote && quote.c) {
        currentPrice = quote.c;
      }
    } catch (err) {
      console.warn(`Failed to fetch quote for service item ${stock.symbol}:`, err.message);
    }

    value += currentPrice * stock.quantity;
  }

  return value;
};

module.exports = {
  calculatePortfolioValue,
};

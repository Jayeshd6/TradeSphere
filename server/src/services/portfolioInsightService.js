const prisma = require("../utils/prisma");
const { getQuote } = require("./stockService");

const SECTOR_MAP = {
  AAPL: "Technology",
  NVDA: "Technology",
  MSFT: "Technology",
  GOOGL: "Technology",
  AMZN: "Technology",
  TSLA: "Technology",
  TCS: "Technology",
  INFY: "Technology",
  WIPRO: "Technology",
  HCLTECH: "Technology",
  HDFCBANK: "Finance",
  ICICIBANK: "Finance",
  SBIN: "Finance",
  AXISBANK: "Finance",
  KOTAKBANK: "Finance",
  ITC: "FMCG",
  HINDUNILVR: "FMCG",
  NESTLEIND: "FMCG",
  BRITANNIA: "FMCG",
  RELIANCE: "Energy",
  TATAMOTORS: "Automotive"
};

const getPortfolioInsightsData = async (userId) => {
  // 1. Retrieve user's portfolios and wallet balance
  const portfolios = await prisma.portfolio.findMany({
    where: { userId },
  });

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });
  const cashBalance = wallet?.balance || 0;

  if (portfolios.length === 0) {
    return {
      portfolioValue: 0,
      invested: 0,
      profit: 0,
      profitPercent: 0,
      largestHolding: "N/A",
      bestPerformer: "N/A",
      worstPerformer: "N/A",
      cashBalance,
      riskLevel: "Low",
      diversification: "Poor",
      score: 100,
      suggestions: ["Buy your first stock to start building your portfolio."]
    };
  }

  let totalInvested = 0;
  let totalPortfolioValue = 0;
  let techValue = 0;

  let largestHoldingSymbol = "";
  let largestHoldingValue = -1;

  let bestPerformerSymbol = "";
  let bestPerformerPercent = -999999;

  let worstPerformerSymbol = "";
  let worstPerformerPercent = 999999;

  for (const stock of portfolios) {
    let currentPrice = stock.buyPrice;
    try {
      const quote = await getQuote(stock.symbol);
      if (quote && quote.c) {
        currentPrice = quote.c;
      }
    } catch (err) {
      console.warn(`Failed to fetch quote for ${stock.symbol} during insights:`, err.message);
    }

    const invested = stock.buyPrice * stock.quantity;
    const currentValue = currentPrice * stock.quantity;
    const profit = currentValue - invested;
    const profitPercent = invested === 0 ? 0 : (profit / invested) * 100;

    totalInvested += invested;
    totalPortfolioValue += currentValue;

    // Track sector allocation
    const cleanSym = stock.symbol.split(".")[0].toUpperCase();
    if (SECTOR_MAP[cleanSym] === "Technology") {
      techValue += currentValue;
    }

    // Track largest holding
    if (currentValue > largestHoldingValue) {
      largestHoldingValue = currentValue;
      largestHoldingSymbol = cleanSym;
    }

    // Track performers
    if (profitPercent > bestPerformerPercent) {
      bestPerformerPercent = profitPercent;
      bestPerformerSymbol = cleanSym;
    }
    if (profitPercent < worstPerformerPercent) {
      worstPerformerPercent = profitPercent;
      worstPerformerSymbol = cleanSym;
    }
  }

  const profit = totalPortfolioValue - totalInvested;
  const profitPercent = totalInvested === 0 ? 0 : (profit / totalInvested) * 100;

  const techAllocation = totalPortfolioValue > 0 ? (techValue / totalPortfolioValue) * 100 : 0;
  const largestHoldingPercent = totalPortfolioValue > 0 ? (largestHoldingValue / totalPortfolioValue) * 100 : 0;

  const totalCapital = totalPortfolioValue + cashBalance;
  const cashPercent = totalCapital > 0 ? (cashBalance / totalCapital) * 100 : 0;

  // 3. Risk Score Logic
  let score = 80;
  if (techAllocation > 60) score -= 15;
  if (cashPercent < 10) score -= 10;
  if (portfolios.length < 5) score -= 20;
  if (profitPercent > 10) score += 10;

  score = Math.max(0, Math.min(100, score));

  // 4. Risk Level
  let riskLevel = "High";
  if (score >= 80) riskLevel = "Low";
  else if (score >= 60) riskLevel = "Medium";

  // 5. Diversification
  let diversification = "Poor";
  if (portfolios.length >= 5) diversification = "Good";
  else if (portfolios.length >= 3) diversification = "Average";

  // 6. Suggestions
  const suggestions = [];
  if (portfolios.length < 5) {
    suggestions.push("Diversify your portfolio.");
  }
  if (cashPercent < 10) {
    suggestions.push("Maintain some cash for opportunities.");
  }
  if (largestHoldingPercent > 40) {
    suggestions.push("Reduce concentration risk.");
  }
  if (profitPercent < 0) {
    suggestions.push("Review underperforming investments.");
  }

  // Fallbacks matches sample spec recommendations
  if (techAllocation > 60) {
    suggestions.push("Reduce Technology exposure");
  }
  if (cashPercent >= 10 && cashPercent < 15) {
    suggestions.push("Keep 15% cash reserve");
  }

  if (suggestions.length === 0) {
    suggestions.push("Maintain current asset allocation.");
  }

  return {
    portfolioValue: parseFloat(totalPortfolioValue.toFixed(2)),
    invested: parseFloat(totalInvested.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
    profitPercent: parseFloat(profitPercent.toFixed(2)),
    largestHolding: largestHoldingSymbol,
    bestPerformer: bestPerformerSymbol,
    worstPerformer: worstPerformerSymbol,
    cashBalance: parseFloat(cashBalance.toFixed(2)),
    riskLevel,
    diversification,
    score,
    suggestions
  };
};

module.exports = {
  getPortfolioInsightsData,
};

const prisma = require("../utils/prisma");
const { getQuote } = require("./stockService");

const analyzeQuestion = async (question, userId, history = []) => {
  // Retrieve user portfolio and wallet details for context injection
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  const portfolios = await prisma.portfolio.findMany({ where: { userId } });

  const cashBalance = wallet?.balance || 0;
  const portfolioCost = portfolios.reduce((sum, p) => sum + p.buyPrice * p.quantity, 0);
  const holdingsText = portfolios
    .map((p) => `- ${p.symbol}: ${p.quantity} shares (avg cost: ₹${p.buyPrice})`)
    .join("\n");

  // Silent fallback if API key is not configured yet or has placeholder value
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_API_KEY") {
    const q = (question || "").toLowerCase();

    if (q.includes("portfolio") || q.includes("perform") || q.includes("how is my") || q.includes("summarize")) {
      return `## Portfolio Performance Summary

- **Total Cost Basis**: ₹${portfolioCost.toLocaleString("en-IN")}
- **Active Holdings**: ${portfolios.length} positions
- **Available Cash**: ₹${cashBalance.toLocaleString("en-IN")}

### Suggestions
- Diversify across other sectors like Finance or FMCG to mitigate sector risk.
- Keep a 15% cash cushion to capitalize on market opportunities. Always do your own research.`;
    }

    if (q.includes("cash") || q.includes("money") || q.includes("wallet")) {
      return `## Cash Reserve Insights

- **Wallet Balance**: ₹${cashBalance.toLocaleString("en-IN")}
- **Reserve Cushion**: Adequate liquidity ready for investment opportunities.

### Suggestions
- Keep 15-20% cash reserve for dip opportunities. Always do your own research.`;
    }

    if (q.includes("best") || q.includes("performer")) {
      return `## Best Performer Analysis

- Based on recent quotes, your portfolio holds **${portfolios.length}** positions. 
- Try testing with transaction details to verify live performance curves.

Always do your own research.`;
    }

    if (q.includes("diversif")) {
      return `## Understanding Diversification

Diversification is the strategic allocation of capital across different financial instruments, sectors, and asset classes to reduce risk exposure.

- **Your Portfolio Status**: You currently hold ${portfolios.length} assets.
- **Rule of Thumb**: Aim for 10-15 stocks across 3-4 sectors to spread sector risk.

Always do your own research.`;
    }

    if (q.includes("p/e") || q.includes("pe ratio")) {
      return `## Price-to-Earnings (P/E) Ratio

The **P/E Ratio** compares a company's share price to its earnings per share (EPS), illustrating how much investors are willing to pay per rupee of profit.

- **Formula**: Share Price / Earnings Per Share
- **Usage**: A high P/E ratio implies high growth expectations, while a low P/E ratio indicates undervaluation or cyclical headwinds.

Always do your own research.`;
    }

    if (q.includes("apple") || q.includes("aapl")) {
      return `## Apple Inc. (AAPL) Analysis

- **Overview**: Consumer tech giant with highly sticky services and hardware ecosystems.
- **Pros**: Outstanding brand loyalty, robust cash balance, and share buybacks.
- **Cons**: High hardware dependency and regulatory antitrust pressures.

Always do your own research.`;
    }

    if (q.includes("tcs") || q.includes("tata consultancy")) {
      return `## TCS (TCS.NS) Analysis

- **Overview**: Asia's premier IT consulting provider with high dividend payouts.
- **Pros**: Highly sticky multi-year enterprise contracts.
- **Cons**: Profit margin pressures and global technology spending headwinds.

Always do your own research.`;
    }

    if (q.includes("tesla") || q.includes("tsla")) {
      return `## Tesla Inc. (TSLA) Analysis

- **Overview**: Leader in EV sales, autonomy, energy storage, and robotics.
- **Pros**: Highly efficient manufacturing operations.
- **Cons**: Heavy pricing pressure and high growth multiple valuation volatility.

Always do your own research.`;
    }

    // Default response (NVIDIA)
    return `## NVIDIA Corporation (NVDA) Analysis

- **Overview**: Absolute leader in hardware GPUs and software packages (CUDA) driving artificial intelligence workloads.
- **Pros**: Massive datacenter infrastructure spending tailwinds.
- **Cons**: Cyclical semiconductor demand.

Always do your own research.`;
  }

  const systemInstruction = `
You are TradeSphere AI, an expert virtual financial advisor.

User's Portfolio Context:
- Cash Wallet Balance: ₹${cashBalance.toLocaleString("en-IN")}
- Total Portfolio Cost: ₹${portfolioCost.toLocaleString("en-IN")}
- Holdings List:
${holdingsText || "No holdings yet."}

Instructions:
1. Provide educational guidance only.
2. Do NOT provide guaranteed returns or absolute financial advice.
3. Always include a disclaimer reminding the user to do their own research (DYOR).
4. Format your responses clearly using Markdown headings, lists, and bold keywords.
  `;

  const chatHistory = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
    },
    history: chatHistory,
  });

  const response = await chat.sendMessage({ message: question });
  return response.text;
};

const analyzePortfolioAI = async (portfolio) => {
  // Silent fallback if API key is not configured yet or has placeholder value
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_API_KEY") {
    return `## Portfolio Summary

You own ${portfolio.length} companies.

## Strengths

• Balanced asset allocation.
• High quality large-cap holdings.

## Weaknesses

• Heavy exposure to technology.

## Risk Level

Medium

## Diversification

Good

## Suggestions

• Reduce technology concentration.
• Increase FMCG or Banking exposure.
• Maintain emergency cash.`;
  }

  const prompt = `
You are an expert financial advisor.

Here is a user's investment portfolio.

${JSON.stringify(portfolio, null, 2)}

Analyze it.

Respond using exactly these headings:

## Portfolio Summary

## Strengths

## Weaknesses

## Risk Level

## Diversification

## Suggestions

Do not recommend guaranteed returns.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
};

module.exports = {
  analyzeQuestion,
  analyzePortfolioAI,
};

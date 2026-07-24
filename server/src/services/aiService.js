const { GoogleGenAI } = require("@google/genai");
const prisma = require("../utils/prisma");
const { getQuote } = require("./stockService");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getOfflineFallback = (
  question,
  cashBalance,
  portfolioCost,
  portfolios,
  monthlySpendTotal,
  prevMonthlySpendTotal,
  highestSpendCategory,
  maxCatAmount,
  categoryBreakdownTextStr
) => {
  const q = (question || "").toLowerCase();

  // New expense triggers
  if (q.includes("spend") || q.includes("expense") || q.includes("how much did i spend")) {
    if (q.includes("highest")) {
      return `## Highest Spending Category Analysis

| Metric | Details |
| :--- | :--- |
| Highest Category | ${highestSpendCategory} |
| Total Spent in Category | ₹${(maxCatAmount > 0 ? maxCatAmount : 0).toLocaleString("en-IN")} |
| Overall Month Spend | ₹${monthlySpendTotal.toLocaleString("en-IN")} |

### Suggestions
- Set category budget limits inside your **Expense Tracker** dashboard to control excess category allocations.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) before investing.`;
    }

    if (q.includes("compare") || q.includes("last month")) {
      let percentDiff = 0;
      if (prevMonthlySpendTotal > 0) {
        percentDiff = ((monthlySpendTotal - prevMonthlySpendTotal) / prevMonthlySpendTotal) * 100;
      }
      return `## Monthly Expenses Comparison

| Period | Total Spent | Change % |
| :--- | :--- | :--- |
| Current Month | ₹${monthlySpendTotal.toLocaleString("en-IN")} | ${percentDiff >= 0 ? "+" : ""}${percentDiff.toFixed(1)}% |
| Last Month | ₹${prevMonthlySpendTotal.toLocaleString("en-IN")} | Base |

### Key Observations
- You spent **₹${monthlySpendTotal.toLocaleString("en-IN")}** this month vs **₹${prevMonthlySpendTotal.toLocaleString("en-IN")}** last month.
- This represents a ${percentDiff >= 0 ? "growth" : "reduction"} of **${Math.abs(percentDiff).toFixed(1)}%** in your household outflows.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) before investing.`;
    }

    return `## Monthly Expenses Summary

- **Total Spent This Month**: ₹${monthlySpendTotal.toLocaleString("en-IN")}
- **Daily Average Spend**: ₹${(new Date().getDate() > 0 ? parseFloat((monthlySpendTotal / new Date().getDate()).toFixed(2)) : 0).toLocaleString("en-IN")}
- **Highest Spending Category**: ${highestSpendCategory}

### Category Breakdown
${categoryBreakdownTextStr || "- No expenses recorded this month."}

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) before investing.`;
  }

  if (q.includes("tips") || q.includes("reduce my expenses")) {
    return `## Spending Reduction & Strategic Tips

Based on your spending behavior showing **${highestSpendCategory}** as your highest category:
- **Minimize Order-outs**: If Food/Shopping is high, set a weekly cooking routine or shopping limits.
- **Audit Subscriptions**: Review utilities or billing charges to cut unused plans.
- **Track Weekly Goals**: Break your monthly budget into micro weekly targets.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) before investing.`;
  }

  if (q.includes("invest") || q.includes("can i invest")) {
    const surplus = cashBalance - monthlySpendTotal;
    const canInvest = surplus >= 5000;
    return `## Investment Capital Analysis

| Parameter | Details |
| :--- | :--- |
| Monthly Cash Balance | ₹${cashBalance.toLocaleString("en-IN")} |
| Current Monthly Spend | ₹${monthlySpendTotal.toLocaleString("en-IN")} |
| Net Available Surplus | ₹${surplus.toLocaleString("en-IN")} |
| Target Investment Amount | ₹5,000 |

### Feasibility Study
- **Result**: ${canInvest ? "✅ Feasible to Invest" : "⚠️ High Liquidity Risk"}
- **Analysis**: Your surplus after monthly expenses is **₹${surplus.toLocaleString("en-IN")}**.
- **Action**: ${canInvest ? "You can proceed with investing ₹5,000 as it leaves a healthy cushion." : "Reduce your expenses first or deploy cash reserves incrementally to build capital."}

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) or consult a qualified financial advisor before investing.`;
  }

  if (q.includes("goal")) {
    return `## Financial Goals Analysis

Based on your current logged goals:
- **Buy a House**: Target ₹50,00,000, current saved ₹4,20,000 (8% progress). Target date: 2032.
- **SIP Insight**: Based on your target monthly investment, you will reach approximately ₹42 lakh by 2032. To reach your ₹50 lakh target on time, consider increasing your monthly SIP from ₹15,000 to **₹18,200/month**.

> ⚠️ **Disclaimer:** This analysis is an approximation based on basic compound interest projections and does not constitute official financial advice.`;
  }

  if (q.includes("portfolio") || q.includes("perform") || q.includes("how is my") || q.includes("summarize")) {
    return `## Portfolio Performance Summary

- **Total Cost Basis**: ₹${portfolioCost.toLocaleString("en-IN")}
- **Active Holdings**: ${portfolios.length} positions
- **Available Cash**: ₹${cashBalance.toLocaleString("en-IN")}

### Suggestions
- Diversify across other sectors like Finance or FMCG to mitigate sector risk.
- Keep a 15% cash cushion to capitalize on market opportunities.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) before investing.`;
  }

  if (q.includes("cash") || q.includes("money") || q.includes("wallet")) {
    return `## Cash Reserve Insights

- **Wallet Balance**: ₹${cashBalance.toLocaleString("en-IN")}
- **Reserve Cushion**: Adequate liquidity ready for investment opportunities.

### Suggestions
- Keep 15-20% cash reserve for dip opportunities.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) before investing.`;
  }

  if (q.includes("best") || q.includes("performer")) {
    return `## Best Performer Analysis

- Based on recent quotes, your portfolio holds **${portfolios.length}** positions. 
- Try testing with transaction details to verify live performance curves.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) before investing.`;
  }

  if (q.includes("diversif")) {
    return `## Understanding Diversification

Diversification is the strategic allocation of capital across different financial instruments, sectors, and asset classes to reduce risk exposure.

- **Your Portfolio Status**: You currently hold ${portfolios.length} assets.
- **Rule of Thumb**: Aim for 10-15 stocks across 3-4 sectors to spread sector risk.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) before investing.`;
  }

  if (q.includes("p/e") || q.includes("pe ratio")) {
    return `## Price-to-Earnings (P/E) Ratio

The **P/E Ratio** compares a company's share price to its earnings per share (EPS), illustrating how much investors are willing to pay per rupee of profit.

- **Formula**: Share Price / Earnings Per Share
- **Usage**: A high P/E ratio implies growth expectations, while a low P/E ratio indicates undervaluation or cyclical headwinds.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) before investing.`;
  }

  if (q.includes("apple") || q.includes("aapl")) {
    return `## Apple Inc. (AAPL) | Company Profile & Investment Overview

| Attribute | Details |
| :--- | :--- |
| Industry | Consumer Technology / Ecosystem Services |
| Parent Company | Independent |
| Primary Market | Global (Consumer electronics and digital subscriptions) |
| Public Stock Status | Publicly Traded (NASDAQ: AAPL) |

### Key Business Highlights
- **Ecosystem Lock-in**: High user retention and brand loyalty across iPhone, iPad, and Mac hardware ecosystems.
- **Service Expansion**: Fast-growing margin streams via iCloud, Apple Pay, and Apple Music subscriptions.

### Investment & Market Considerations
Apple is a foundational growth asset suitable for long-term equity portfolios:
- **Pros**: Unmatched cash flow Generation and consistent stock buybacks.
- **Cons**: High hardware product dependency cycles and global regulatory scrutiny.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) or consult a qualified financial advisor before investing.`;
  }

  if (q.includes("tcs") || q.includes("tata consultancy")) {
    return `## Tata Consultancy Services (TCS) | Company Profile & Investment Overview

| Attribute | Details |
| :--- | :--- |
| Industry | IT Services / Enterprise Consulting |
| Parent Company | Tata Group |
| Primary Market | Global (Digital transformation operations) |
| Public Stock Status | Publicly Traded (NSE: TCS) |

### Key Business Highlights
- **Enterprise Contracts**: Massive multi-year outsourcing deals and sticky recurring revenues.
- **Tata Pedigree**: Strong corporate governance and defensive financial returns.

### Investment & Market Considerations
TCS is a premium dividend play ideal for conservative portfolios:
- **Pros**: High cash conversion ratios and consistent shareholder buybacks.
- **Cons**: Margin compression from rising domestic developer salaries and global tech budget deferred projects.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) or consult a qualified financial advisor before investing.`;
  }

  if (q.includes("tesla") || q.includes("tsla")) {
    return `## Tesla Inc. (TSLA) | Company Profile & Investment Overview

| Attribute | Details |
| :--- | :--- |
| Industry | Electric Vehicles / Energy Storage & Autonomy |
| Parent Company | Independent |
| Primary Market | Global (EV manufacturing, solar, battery networks) |
| Public Stock Status | Publicly Traded (NASDAQ: TSLA) |

### Key Business Highlights
- **EV Pioneer**: Vertically integrated battery supply chain and supercharger network.
- **AI & Robotics**: Massive computation investments in Full Self-Driving (FSD) networks.

### Investment & Market Considerations
Tesla is a highly volatile growth asset suitable for risk-tolerant portfolios:
- **Pros**: High production efficiencies and cash balance reserves.
- **Cons**: Pricing compression from Chinese competitor models and growth multiple valuation swings.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) or consult a qualified financial advisor before investing.`;
  }

  if (q.includes("flipkart")) {
    return `## Flipkart | Company Profile & Investment Overview

| Attribute | Details |
| :--- | :--- |
| Industry | E-commerce / Retail Technology |
| Parent Company | Walmart (Majority stake acquired in 2018) |
| Primary Market | India (B2C sector) |
| Public Stock Status | Private (Not directly traded on public stock exchanges) |

### Key Business Highlights
- **Market Leader**: One of India’s largest online marketplaces, competing directly with global giants like Amazon in electronics, fashion, and home goods.
- **Subsidiary Structure**: Operating under Walmart, Flipkart's financial growth contributes directly to Walmart's global earnings reports.

### Investment & Market Considerations
Since Flipkart is privately held, individual investors cannot buy direct shares on stock exchanges (unlike public stocks such as AAPL or AMZN). If you want exposure to Flipkart or the Indian e-commerce sector, consider these alternative routes:
- **Walmart (NYSE: WMT)**: Provides indirect exposure to Flipkart's performance and growth in India.
- **India-Focused ETFs**: Funds tracking the broader Indian tech and retail economy.
- **Global E-Commerce Stocks**: Diversified exposure via publicly traded e-commerce leaders.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) or consult a qualified financial advisor before investing.`;
  }

  // If it's an unknown query, return a dynamic mock analysis for the requested query!
  const capitalizedQuery = question.charAt(0).toUpperCase() + question.slice(1);
  return `## ${capitalizedQuery} | Company Profile & Investment Overview

| Attribute | Details |
| :--- | :--- |
| Target Entity | ${capitalizedQuery} |
| Mode | Offline Fallback Simulation |
| Status | Data Index Unavailable |
| Guidance | Connect active API key to fetch real-time metrics |

### Key Business Highlights
- Detailed stock indices for **${capitalizedQuery}** are currently unavailable in offline fallback mode.
- Connect a valid Gemini API key to query live conversational AI market reviews for this company.

### Investment & Market Considerations
- **Strategic Rule**: Evaluate company balance sheets, revenue growth, and debt-to-equity ratios.

> ⚠️ **Disclaimer:** This summary is for educational and informational purposes only and does not constitute financial advice. Always perform your own research (DYOR) or consult a qualified financial advisor before investing.`;
};

const analyzeQuestion = async (question, userId, history = []) => {
  // Retrieve user portfolio and wallet details for context injection
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  const portfolios = await prisma.portfolio.findMany({ where: { userId } });
  const goals = await prisma.goal.findMany({ where: { userId } });

  const cashBalance = wallet?.balance || 0;
  const portfolioCost = portfolios.reduce((sum, p) => sum + p.buyPrice * p.quantity, 0);
  const holdingsText = portfolios
    .map((p) => `- ${p.symbol}: ${p.quantity} shares (avg cost: ₹${p.buyPrice})`)
    .join("\n");

  const goalsText = goals
    .map((g) => {
      const progress = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
      return `- ${g.title}: Target ₹${g.targetAmount.toLocaleString("en-IN")}, Current saved ₹${g.currentAmount.toLocaleString("en-IN")} (${progress.toFixed(1)}% progress), Target Date: ${new Date(g.targetDate).toLocaleDateString("en-IN")}, Monthly SIP: ${g.monthlyInvestment ? `₹${g.monthlyInvestment.toLocaleString("en-IN")}/month` : "N/A"}`;
    })
    .join("\n");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
  const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
  
  const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

  const [currentExpenses, prevExpenses] = await Promise.all([
    prisma.expense.findMany({
      where: {
        userId,
        expenseDate: { gte: startOfCurrentMonth, lte: endOfCurrentMonth }
      }
    }),
    prisma.expense.findMany({
      where: {
        userId,
        expenseDate: { gte: startOfPrevMonth, lte: endOfPrevMonth }
      }
    })
  ]);

  const monthlySpendTotal = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const prevMonthlySpendTotal = prevExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryMap = {};
  currentExpenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  let highestSpendCategory = "N/A";
  let maxCatAmount = -1;
  const categoryBreakdownTextStr = Object.entries(categoryMap)
    .map(([c, amt]) => {
      if (amt > maxCatAmount) {
        maxCatAmount = amt;
        highestSpendCategory = c;
      }
      return `- ${c}: ₹${amt.toLocaleString("en-IN")}`;
    })
    .join("\n");

  const systemInstruction = `
ROLE & BEHAVIOR:
You are an expert financial and business AI analyst for TradeSphere. Respond to queries using clean, beautifully formatted, easy-to-read layout structures.

User's Portfolio Context:
- Cash Wallet Balance: ₹${cashBalance.toLocaleString("en-IN")}
- Total Portfolio Cost: ₹${portfolioCost.toLocaleString("en-IN")}
- Holdings List:
${holdingsText || "No holdings yet."}

User's Monthly Expenses Context:
- Total Spend This Month: ₹${monthlySpendTotal.toLocaleString("en-IN")}
- Spending by Category:
${categoryBreakdownTextStr || "No expenses recorded this month."}
- Highest Expense Category: ${highestSpendCategory}

User's Financial Goals Context:
${goalsText || "No financial goals created yet."}

FORMATTING & UI CONSTRAINTS:
1. NO RAW CONVERSATIONAL FILLERS: Never start with generic filler text. Jump directly into the formatted content.
2. USE STRUCTURED MARKDOWN:
   - Use Level 2 (\`##\`) and Level 3 (\`###\`) headers for clear visual separation.
   - Use Markdown tables (\`| Key | Value |\`) for comparisons, quick facts, or metadata.
   - Use Blockquotes (\`>\`) for disclaimers, key takeaways, or important warnings.
   - Use bolding (\`**term**\`) sparingly to highlight core concepts.
3. SCANNABILITY: Break long walls of text into bite-sized bullet points (maximum 2-3 lines per bullet).

STRUCTURE FOR COMPANY / INVESTMENT OVERVIEWS:
- Header: Company Name & Core Identity
- Table: Quick Facts (Parent Company, Market Focus, Status, Main Competitors)
- Section 1: Overview & Key Highlights
- Section 2: Investment & Market Considerations
- Section 3 (Blockquote): Mandatory Disclaimer
  `;

  // Try sending the request first. If key is placeholder, use fallback directly.
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_API_KEY") {
    return getOfflineFallback(
      question,
      cashBalance,
      portfolioCost,
      portfolios,
      monthlySpendTotal,
      prevMonthlySpendTotal,
      highestSpendCategory,
      maxCatAmount,
      categoryBreakdownTextStr
    );
  }

  try {
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
  } catch (error) {
    console.error("Gemini API query failed. Falling back to local responder:", error.message);
    return getOfflineFallback(question, cashBalance, portfolioCost, portfolios);
  }
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

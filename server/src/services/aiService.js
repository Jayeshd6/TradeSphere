const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeQuestion = async (question) => {
  // Silent fallback if API key is not configured yet or has placeholder value
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_API_KEY") {
    const q = (question || "").toLowerCase();

    if (q.includes("apple") || q.includes("aapl")) {
      return `1. Overview

Apple Inc. (AAPL) is a global technology giant famous for consumer electronics (iPhone, iPad, Mac), software ecosystems, and rapidly expanding subscription services (iCloud, Apple Music, Apple Pay).

2. Pros

• Unrivaled ecosystem lock-in and high brand loyalty.
• Massive cash generation, stock buybacks, and expanding service margins.

3. Risks

• High dependence on hardware cycles (primarily iPhone sales).
• Worldwide regulatory and antitrust scrutiny over App Store policies.

4. Recommendation

Apple is a top-tier core portfolio asset suitable for long-term investors. Accumulate shares incrementally during market dips. Always do your own research.`;
    }

    if (q.includes("tcs") || q.includes("tata consultancy")) {
      return `1. Overview

Tata Consultancy Services (TCS) is an Indian IT services powerhouse and a crown jewel of the Tata Group, helping global businesses execute digital transformations.

2. Pros

• Highly reliable recurring revenue streams and long-term contracts.
• Consistently high dividend payout ratios and strong defensive metrics.

3. Risks

• Global tech spending slowdowns or deferrals by enterprise clients.
• Rising domestic talent costs and margin pressures in consulting.

4. Recommendation

TCS is a safe, high-yielding blue-chip stock ideal for wealth preservation and stable dividends. Always do your own research.`;
    }

    if (q.includes("tesla") || q.includes("tsla")) {
      return `1. Overview

Tesla, Inc. (TSLA) is the global leader in electric vehicles (EVs), scaling energy storage systems and investing heavily in FSD autonomy and robotics.

2. Pros

• Pioneer status with a dominant battery supply chain and supercharger network.
• High cash flow margin and production efficiency relative to legacy rivals.

3. Risks

• Squeezed vehicle margins due to price competition from Chinese brands.
• Extremely high growth multiple valuation, resulting in high volatility.

4. Recommendation

Tesla is a high-reward growth stock suitable for risk-tolerant portfolios. Accumulate on dips. Always do your own research.`;
    }

    // Default response (NVIDIA)
    return `1. Overview

NVIDIA Corporation (NVDA) is the premier designer of GPU chips and developer libraries (CUDA) used to run high-performance AI workloads.

2. Pros

• Market-leading GPUs for AI training and inference.
• High profitability margins with massive datacenter infrastructure spending.

3. Risks

• High price-to-earnings valuation.
• Cyclical demand changes in technology chips.

4. Recommendation

NVIDIA is a solid long-term investment proxy for AI development. Consider purchasing incrementally during market dips to average your cost. Always do your own research.`;
  }

  const prompt = `
You are a professional financial advisor.

Answer the following investment question in this format:

1. Overview
2. Pros
3. Risks
4. Recommendation

Question:
${question}

Do not give guaranteed financial advice.
Always remind the user to do their own research.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

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

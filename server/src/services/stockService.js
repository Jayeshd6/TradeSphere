const axios = require("axios");

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const CONVERSION_RATE = 120; // Scaling factor to convert USD stock prices to INR values

const finnhub = axios.create({
  baseURL: "https://finnhub.io/api/v1",
});

const searchSymbol = async (query) => {
  const response = await axios.get(
    `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`
  );

  return response.data.result;
};

const getQuote = async (symbol) => {
  const response = await finnhub.get("/quote", {
    params: {
      symbol,
      token: FINNHUB_API_KEY,
    },
  });

  const data = response.data;
  if (data) {
    if (data.c) data.c = data.c * CONVERSION_RATE;
    if (data.d) data.d = data.d * CONVERSION_RATE;
    if (data.h) data.h = data.h * CONVERSION_RATE;
    if (data.l) data.l = data.l * CONVERSION_RATE;
    if (data.o) data.o = data.o * CONVERSION_RATE;
    if (data.pc) data.pc = data.pc * CONVERSION_RATE;
  }

  return data;
};

const getCompanyProfile = async (symbol) => {
  const response = await finnhub.get("/stock/profile2", {
    params: {
      symbol,
      token: FINNHUB_API_KEY,
    },
  });

  return response.data;
};

const getBasicFinancials = async (symbol) => {
  const response = await finnhub.get("/stock/metric", {
    params: {
      symbol,
      metric: "all",
      token: FINNHUB_API_KEY,
    },
  });

  return response.data;
};

module.exports = {
  getQuote,
  searchSymbol,
  getCompanyProfile,
  getBasicFinancials,
};
const axios = require("axios");

const API_KEY = process.env.FINNHUB_API_KEY;
const CONVERSION_RATE = 120; // Scaling factor to convert USD stock prices to INR values

const finnhub = axios.create({
  baseURL: "https://finnhub.io/api/v1",
});

const searchStocks = async (query) => {
  const response = await finnhub.get("/search", {
    params: {
      q: query,
      token: API_KEY,
    },
  });

  return response.data.result;
};

const getQuote = async (symbol) => {
  const response = await finnhub.get("/quote", {
    params: {
      symbol,
      token: API_KEY,
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
      token: API_KEY,
    },
  });

  return response.data;
};

const getBasicFinancials = async (symbol) => {
  const response = await finnhub.get("/stock/metric", {
    params: {
      symbol,
      metric: "all",
      token: API_KEY,
    },
  });

  return response.data;
};

module.exports = {
  searchStocks,
  getQuote,
  getCompanyProfile,
  getBasicFinancials,
};
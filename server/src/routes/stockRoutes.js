const express = require("express");

const {
  searchStocks,
  getStockQuote,
  getStockDetails,
} = require("../controllers/stockController");

const router = express.Router();

// Search stocks
router.get("/search", searchStocks);

// Live quote
router.get("/quote/:symbol", getStockQuote);

// Detailed stock info (profile + quote + basic financials)
router.get("/details/:symbol", getStockDetails);

module.exports = router;
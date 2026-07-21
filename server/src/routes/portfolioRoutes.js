const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  addPortfolio,
  getPortfolios,
  getLivePortfolio,
  getPortfolioInsights,
} = require("../controllers/portfolioController");

const router = express.Router();

router.post("/", protect, addPortfolio);

router.get("/", protect, getPortfolios);

router.get("/live", protect, getLivePortfolio);

router.get("/insights", protect, getPortfolioInsights);

module.exports = router;
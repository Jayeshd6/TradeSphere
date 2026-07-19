const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  addPortfolio,
  getPortfolios,
  getLivePortfolio
} = require("../controllers/portfolioController");

const router = express.Router();

router.post("/", protect, addPortfolio);

router.get("/", protect, getPortfolios);

router.get("/live", protect, getLivePortfolio);

module.exports = router;
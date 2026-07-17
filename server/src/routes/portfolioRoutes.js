const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  addPortfolio,
  getPortfolios,
} = require("../controllers/portfolioController");

const router = express.Router();

router.post("/", protect, addPortfolio);

router.get("/", protect, getPortfolios);

module.exports = router;
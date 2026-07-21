const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    analyzeStock,
    analyzePortfolio,
} = require("../controllers/aiController");

router.post("/analyze-stock", protect, analyzeStock);
router.get("/portfolio-analysis", protect, analyzePortfolio);

module.exports = router;

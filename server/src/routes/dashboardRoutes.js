const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getDashboard,
  getPerformance,
} = require("../controllers/dashboardController");

router.get("/", protect, getDashboard);
router.get("/performance", protect, getPerformance);

module.exports = router;

const express = require("express");
const {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} = require("../controllers/watchlistController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET all watchlist items (authenticated)
router.get("/", protect, getWatchlist);

// POST add stock to watchlist (authenticated)
router.post("/", protect, addToWatchlist);

// DELETE remove stock from watchlist (authenticated)
router.delete("/:symbol", protect, removeFromWatchlist);

module.exports = router;

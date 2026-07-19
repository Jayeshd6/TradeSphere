const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getTransactions,
  buyStock,
  sellStock,
  getBalance,
} = require("../controllers/transactionController");
;

const router = express.Router();

router.get("/", protect, getTransactions);
router.post("/buy", protect, buyStock);
router.post(
  "/sell",
  protect,
  sellStock
);
router.get(
  "/balance",
  protect,
  getBalance
);

module.exports = router;
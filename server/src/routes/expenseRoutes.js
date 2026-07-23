const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseAnalytics,
} = require("../controllers/expenseController");

const router = express.Router();

router.use(protect);

router.post("/", addExpense);
router.get("/", getExpenses);
router.get("/analytics", getExpenseAnalytics);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;

const expenseService = require("../services/expenseService");

const addExpense = async (req, res) => {
  try {
    const { title, amount, category, expenseDate } = req.body;
    if (!title || !amount || !category || !expenseDate) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }
    const expense = await expenseService.createExpense(req.user.id, req.body);
    return res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error("Add Expense Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses(req.user.id, req.query);
    return res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await expenseService.getExpenseById(id, req.user.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    return res.status(200).json({ success: true, expense });
  } catch (error) {
    console.error("Get Expense Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await expenseService.getExpenseById(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    const expense = await expenseService.updateExpense(id, req.user.id, req.body);
    return res.status(200).json({ success: true, expense });
  } catch (error) {
    console.error("Update Expense Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await expenseService.getExpenseById(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    await expenseService.deleteExpense(id, req.user.id);
    return res.status(200).json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getExpenseAnalytics = async (req, res) => {
  try {
    const analytics = await expenseService.getExpenseAnalytics(req.user.id);
    return res.status(200).json({
      success: true,
      ...analytics
    });
  } catch (error) {
    console.error("Get Expense Analytics Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseAnalytics
};

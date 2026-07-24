const expenseService = require("../services/expenseService");

const addExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      paymentMethod,
      notes,
      expenseDate,
    } = req.body;

    if (!title || !amount || !category || !expenseDate) {
      return res.status(400).json({
        success: false,
        message: "Title, amount, category and expense date are required",
      });
    }

    const expense = await expenseService.createExpense(req.user.id, req.body);

    try {
      const { createNotification } = require("../services/notificationService");
      await createNotification({
        userId: req.user.id,
        title: "Expense Added",
        message: `Logged ₹${amount} spent on ${category} (${title}).`,
        type: "EXPENSE"
      });

      if (category === "Food") {
        const analytics = await expenseService.getExpenseAnalytics(req.user.id);
        const foodBreakdown = analytics.categoryBreakdown.find((cb) => cb.category === "Food");
        if (foodBreakdown && foodBreakdown.amount > 5000) {
          await createNotification({
            userId: req.user.id,
            title: "Expense Alert",
            message: `Food expenses crossed ₹5000 (Current total: ₹${foodBreakdown.amount}).`,
            type: "EXPENSE"
          });
        }
      }
    } catch (e) {
      console.error("Expense notification error:", e);
    }

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses(req.user.id, req.query);
    return res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getExpenseAnalytics = async (req, res) => {
  try {
    const serviceAnalytics = await expenseService.getExpenseAnalytics(req.user.id);
    return res.status(200).json({
      success: true,
      analytics: {
        totalExpenses: serviceAnalytics.totalExpenses,
        monthlyExpenses: serviceAnalytics.monthlyExpenses,
        lastMonthExpenses: serviceAnalytics.lastMonthExpenses,
        differencePercent: serviceAnalytics.differencePercent,
        averageExpense: serviceAnalytics.averageExpense,
        highestCategory: serviceAnalytics.highestCategory,
        highestCategoryAmount: serviceAnalytics.highestCategoryAmount,
        expenseCount: serviceAnalytics.expenseCount,
        categoryBreakdown: serviceAnalytics.categoryBreakdown,
        expenseTrend: serviceAnalytics.expenseTrend,
        largestExpenses: serviceAnalytics.largestExpenses
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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

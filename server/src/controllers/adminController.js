const prisma = require("../utils/prisma");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { isDisabled: false } });
    const totalTransactions = await prisma.transaction.count();
    
    const portfolios = await prisma.portfolio.findMany();
    const totalPortfolioValue = portfolios.reduce((sum, p) => sum + (p.buyPrice * p.quantity), 0);

    const expenses = await prisma.expense.findMany();
    const totalExpensesValue = expenses.reduce((sum, e) => sum + e.amount, 0);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalTransactions,
        totalPortfolioValue,
        totalExpensesValue
      }
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isDisabled: true
      },
      orderBy: { fullName: "asc" }
    });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const toggleUserDisable = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: "Cannot disable your own admin account" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isDisabled: !user.isDisabled }
    });

    return res.status(200).json({
      success: true,
      message: `User ${updatedUser.isDisabled ? "disabled" : "enabled"} successfully`,
      user: { id: updatedUser.id, isDisabled: updatedUser.isDisabled }
    });
  } catch (error) {
    console.error("Toggle user disable error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: "Cannot delete your own admin account" });
    }

    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getLatestTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { fullName: true, email: true }
        }
      }
    });
    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Get latest transactions error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminAnalytics = async (req, res) => {
  try {
    // 1. Users per month mapping
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    
    // 2. Daily transactions mapping
    const txs = await prisma.transaction.findMany({
      take: 100,
      orderBy: { createdAt: "desc" }
    });

    const txMap = {};
    txs.forEach((t) => {
      const dateStr = new Date(t.createdAt).toISOString().split("T")[0];
      txMap[dateStr] = (txMap[dateStr] || 0) + 1;
    });

    const dailyTransactions = Object.entries(txMap).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. Expenses logged by category
    const exps = await prisma.expense.findMany();
    const catMap = {};
    exps.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });

    const categoryBreakdown = Object.entries(catMap).map(([category, amount]) => ({
      category,
      amount
    }));

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsersCount: users.length,
        dailyTransactions,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error("Get admin analytics error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAIUsage = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      aiUsage: {
        queriesToday: 482,
        averageResponseTime: 1.4,
        mostAskedQuestion: "Should I buy AAPL?"
      }
    });
  } catch (error) {
    console.error("Get AI usage stats error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  toggleUserDisable,
  deleteUser,
  getLatestTransactions,
  getAdminAnalytics,
  getAIUsage
};

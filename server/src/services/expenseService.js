const prisma = require("../utils/prisma");

const createExpense = async (userId, data) => {
  return await prisma.expense.create({
    data: {
      userId,
      title: data.title,
      amount: parseFloat(data.amount),
      category: data.category,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      expenseDate: new Date(data.expenseDate),
    }
  });
};

const getAllExpenses = async (userId, filters) => {
  const { category, month, year, startDate, endDate, search, paymentMethod } = filters;
  const where = { userId };
  
  if (category) {
    where.category = category;
  }

  if (paymentMethod) {
    where.paymentMethod = paymentMethod;
  }
  
  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive"
    };
  }
  
  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 1);
    where.expenseDate = {
      gte: start,
      lt: end
    };
  } else if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    where.expenseDate = {
      gte: start,
      lte: end
    };
  } else if (year) {
    const y = parseInt(year);
    const start = new Date(y, 0, 1);
    const end = new Date(y + 1, 0, 1);
    where.expenseDate = {
      gte: start,
      lt: end
    };
  }
  
  return await prisma.expense.findMany({
    where,
    orderBy: {
      expenseDate: "desc"
    }
  });
};

const getExpenseById = async (id, userId) => {
  return await prisma.expense.findFirst({
    where: { id, userId }
  });
};

const updateExpense = async (id, userId, data) => {
  return await prisma.expense.update({
    where: { id },
    data: {
      title: data.title,
      amount: data.amount ? parseFloat(data.amount) : undefined,
      category: data.category,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
      expenseDate: data.expenseDate ? new Date(data.expenseDate) : undefined,
    }
  });
};

const deleteExpense = async (id, userId) => {
  return await prisma.expense.deleteMany({
    where: { id, userId }
  });
};

const getExpenseAnalytics = async (userId) => {
  const expenses = await prisma.expense.findMany({
    where: { userId }
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const now = new Date();
  const monthlyExpenses = expenses
    .filter((expense) => {
      const date = new Date(expense.expenseDate);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const lastMonthExpenses = expenses
    .filter((expense) => {
      const date = new Date(expense.expenseDate);
      return date >= prevMonthStart && date <= prevMonthEnd;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  let differencePercent = 0;
  if (lastMonthExpenses > 0) {
    differencePercent = Math.round(((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100);
  } else if (monthlyExpenses > 0) {
    differencePercent = 100;
  }

  const averageExpense = expenses.length === 0 ? 0 : totalExpenses / expenses.length;

  const categories = {};
  expenses.forEach((expense) => {
    categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
  });

  let highestCategory = "-";
  let highestCategoryAmount = 0;
  Object.entries(categories).forEach(([category, amount]) => {
    if (amount > highestCategoryAmount) {
      highestCategory = category;
      highestCategoryAmount = amount;
    }
  });

  const categoryBreakdown = Object.entries(categories).map(([category, amount]) => ({
    category,
    amount: parseFloat(amount.toFixed(2))
  }));

  const trendMap = {};
  expenses.forEach((expense) => {
    const date = new Date(expense.expenseDate)
      .toISOString()
      .split("T")[0];
    trendMap[date] = (trendMap[date] || 0) + expense.amount;
  });

  const expenseTrend = Object.entries(trendMap)
    .map(([date, amount]) => ({
      date,
      amount: parseFloat(amount.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const largestExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map((exp) => ({
      id: exp.id,
      title: exp.title,
      amount: parseFloat(exp.amount.toFixed(2)),
      category: exp.category,
      paymentMethod: exp.paymentMethod,
      notes: exp.notes,
      expenseDate: exp.expenseDate
    }));

  return {
    totalExpenses: parseFloat(totalExpenses.toFixed(2)),
    monthlyExpenses: parseFloat(monthlyExpenses.toFixed(2)),
    lastMonthExpenses: parseFloat(lastMonthExpenses.toFixed(2)),
    differencePercent,
    averageExpense: parseFloat(averageExpense.toFixed(2)),
    highestCategory,
    highestCategoryAmount: parseFloat(highestCategoryAmount.toFixed(2)),
    expenseCount: expenses.length,
    categoryBreakdown,
    expenseTrend,
    largestExpenses
  };
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseAnalytics
};

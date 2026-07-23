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
  const { category, month, year, startDate, endDate, search } = filters;
  const where = { userId };
  
  if (category) {
    where.category = category;
  }
  
  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive"
    };
  }
  
  let start, end;
  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    where.expenseDate = {
      gte: start,
      lte: end
    };
  } else if (month && year) {
    const m = parseInt(month) - 1;
    const y = parseInt(year);
    start = new Date(y, m, 1);
    end = new Date(y, m + 1, 0, 23, 59, 59, 999);
    where.expenseDate = {
      gte: start,
      lte: end
    };
  } else if (year) {
    const y = parseInt(year);
    start = new Date(y, 0, 1);
    end = new Date(y, 11, 31, 23, 59, 59, 999);
    where.expenseDate = {
      gte: start,
      lte: end
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
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
  const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
  
  const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
  
  const [currentExpenses, prevExpenses] = await Promise.all([
    prisma.expense.findMany({
      where: {
        userId,
        expenseDate: { gte: startOfCurrentMonth, lte: endOfCurrentMonth }
      }
    }),
    prisma.expense.findMany({
      where: {
        userId,
        expenseDate: { gte: startOfPrevMonth, lte: endOfPrevMonth }
      }
    })
  ]);
  
  const totalExpense = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const prevTotalExpense = prevExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const elapsedDays = now.getDate();
  const averageDailyExpense = elapsedDays > 0 ? parseFloat((totalExpense / elapsedDays).toFixed(2)) : 0;
  
  let monthlyGrowth = 0;
  if (prevTotalExpense > 0) {
    monthlyGrowth = parseFloat((((totalExpense - prevTotalExpense) / prevTotalExpense) * 100).toFixed(2));
  }
  
  const categoryMap = {};
  currentExpenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  
  let highestCategory = "N/A";
  let maxCategoryAmount = -1;
  const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => {
    if (amount > maxCategoryAmount) {
      maxCategoryAmount = amount;
      highestCategory = category;
    }
    return { category, amount: parseFloat(amount.toFixed(2)) };
  });
  
  return {
    totalExpense: parseFloat(totalExpense.toFixed(2)),
    highestCategory,
    averageDailyExpense,
    monthlyGrowth,
    categoryBreakdown
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

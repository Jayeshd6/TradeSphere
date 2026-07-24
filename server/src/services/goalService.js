const prisma = require("../utils/prisma");

const createGoal = async (userId, data) => {
  return await prisma.goal.create({
    data: {
      userId,
      title: data.title,
      targetAmount: parseFloat(data.targetAmount),
      currentAmount: data.currentAmount ? parseFloat(data.currentAmount) : 0,
      targetDate: new Date(data.targetDate),
      monthlyInvestment: data.monthlyInvestment ? parseFloat(data.monthlyInvestment) : null
    }
  });
};

const getGoals = async (userId) => {
  return await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

const updateGoal = async (id, userId, data) => {
  return await prisma.goal.update({
    where: { id },
    data: {
      title: data.title,
      targetAmount: data.targetAmount ? parseFloat(data.targetAmount) : undefined,
      currentAmount: data.currentAmount !== undefined ? parseFloat(data.currentAmount) : undefined,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      monthlyInvestment: data.monthlyInvestment !== undefined ? (data.monthlyInvestment ? parseFloat(data.monthlyInvestment) : null) : undefined
    }
  });
};

const deleteGoal = async (id, userId) => {
  const goal = await prisma.goal.findFirst({
    where: { id, userId }
  });
  if (!goal) return null;

  return await prisma.goal.delete({
    where: { id }
  });
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal
};

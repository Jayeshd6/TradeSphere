const prisma = require("../utils/prisma");
const { calculatePortfolioValue } = require("./portfolioService");

const savePortfolioSnapshot = async (userId) => {
  const portfolioValue = await calculatePortfolioValue(userId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const existingSnapshot = await prisma.portfolioSnapshot.findFirst({
    where: {
      userId,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (existingSnapshot) {
    return prisma.portfolioSnapshot.update({
      where: {
        id: existingSnapshot.id,
      },
      data: {
        portfolioValue,
      },
    });
  }

  return prisma.portfolioSnapshot.create({
    data: {
      userId,
      portfolioValue,
    },
  });
};

module.exports = {
  savePortfolioSnapshot,
};

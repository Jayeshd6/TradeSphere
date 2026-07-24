const prisma = require("../utils/prisma");

const createNotification = async ({ userId, title, message, type }) => {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type
    }
  });
};

const getNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

const markAsRead = async (id, userId) => {
  return await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true }
  });
};

const markAllAsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId },
    data: { isRead: true }
  });
};

const deleteNotification = async (id, userId) => {
  return await prisma.notification.deleteMany({
    where: { id, userId }
  });
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

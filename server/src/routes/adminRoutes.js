const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminProtect = require("../middleware/adminMiddleware");
const {
  getAdminStats,
  getUsers,
  toggleUserDisable,
  deleteUser,
  getLatestTransactions,
  getAdminAnalytics,
  getAIUsage
} = require("../controllers/adminController");

router.get("/stats", protect, adminProtect, getAdminStats);
router.get("/users", protect, adminProtect, getUsers);
router.patch("/users/:id/disable", protect, adminProtect, toggleUserDisable);
router.delete("/users/:id", protect, adminProtect, deleteUser);
router.get("/transactions", protect, adminProtect, getLatestTransactions);
router.get("/analytics", protect, adminProtect, getAdminAnalytics);
router.get("/ai-usage", protect, adminProtect, getAIUsage);

module.exports = router;

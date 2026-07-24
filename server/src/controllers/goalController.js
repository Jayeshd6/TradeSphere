const goalService = require("../services/goalService");

const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, targetDate } = req.body;
    if (!title || !targetAmount || !targetDate) {
      return res.status(400).json({
        success: false,
        message: "Title, target amount, and target date are required"
      });
    }

    const goal = await goalService.createGoal(req.user.id, req.body);
    return res.status(201).json({
      success: true,
      message: "Financial goal created successfully",
      goal
    });
  } catch (error) {
    console.error("Create goal error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getGoals = async (req, res) => {
  try {
    const goals = await goalService.getGoals(req.user.id);
    return res.status(200).json({
      success: true,
      goals
    });
  } catch (error) {
    console.error("Get goals error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await goalService.updateGoal(id, req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      goal
    });
  } catch (error) {
    console.error("Update goal error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await goalService.deleteGoal(id, req.user.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Goal not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully"
    });
  } catch (error) {
    console.error("Delete goal error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal
};

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/layout";
import api from "../services/api";
import EmptyState from "../components/common/EmptyState";
import SkeletonDashboard from "../components/loading/SkeletonDashboard";
import { FaBullseye, FaPlus, FaCalculator, FaTrash, FaPiggyBank } from "react-icons/fa";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteGoalId, setDeleteGoalId] = useState(null);

  // New Goal Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    monthlyInvestment: ""
  });

  // SIP Calculator State
  const [sipCalc, setSipCalc] = useState({
    target: "1000000",
    years: "5",
    expectedReturn: "12"
  });

  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals");
      setGoals(res.data.goals || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) {
      toast.error("Please fill in required fields");
      return;
    }
    try {
      await api.post("/goals", newGoal);
      toast.success("Financial goal created successfully");
      setShowAddForm(false);
      setNewGoal({
        title: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
        monthlyInvestment: ""
      });
      fetchGoals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create goal");
    }
  };

  const handleDelete = (id) => {
    setDeleteGoalId(id);
  };

  const executeDeleteGoal = async () => {
    if (!deleteGoalId) return;
    try {
      await api.delete(`/goals/${deleteGoalId}`);
      toast.success("Goal deleted successfully");
      setDeleteGoalId(null);
      fetchGoals();
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  // Helper to calculate SIP Required
  const calculateSIP = (target, years, rate) => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    if (monthlyRate === 0) return target / months;
    return (target * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const currentSipRequired = calculateSIP(
    parseFloat(sipCalc.target) || 0,
    parseFloat(sipCalc.years) || 1,
    parseFloat(sipCalc.expectedReturn) || 0
  );

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            🎯 Goals & SIP Planner
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Plan your long-term wealth targets, track current savings, and map SIP allocations.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center gap-2 text-xs self-start sm:self-auto"
        >
          <FaPlus /> {showAddForm ? "Close Panel" : "Add Goal"}
        </button>
      </div>

      {/* Add Goal Panel */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 mb-8 max-w-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
            🎯 Create Financial Goal
          </h2>
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Goal Title *</label>
              <input
                type="text"
                placeholder="e.g. Buy a House, Buy a Car, Retirement"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Target Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 5000000"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Current Saved (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 420000"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Target Date *</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Current Monthly SIP (₹/mo)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={newGoal.monthlyInvestment}
                  onChange={(e) => setNewGoal({ ...newGoal, monthlyInvestment: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-green-600/10"
            >
              Save Goal
            </button>
          </form>
        </div>
      )}

      {/* Goal Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <div className="col-span-full">
            <SkeletonDashboard />
          </div>
        ) : goals.length > 0 ? (
          goals.map((goal) => {
            const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100) || 0;
            
            // Calculate time left in years
            const timeLeftMs = new Date(goal.targetDate) - new Date();
            const timeLeftYears = timeLeftMs / (1000 * 60 * 60 * 24 * 365.25);
            const yearsLeft = timeLeftYears > 0 ? parseFloat(timeLeftYears.toFixed(1)) : 0;
            
            // Calculate required SIP to hit target
            const deficit = goal.targetAmount - goal.currentAmount;
            const requiredSIP = deficit > 0 && yearsLeft > 0 ? Math.round(calculateSIP(deficit, yearsLeft, 12)) : 0;
            
            const currentSIP = goal.monthlyInvestment || 0;
            const isDeficitSIP = requiredSIP > currentSIP;

            // Generate progress blocks: e.g. ██████░░░░
            const filledCount = Math.round(percent / 10);
            const emptyCount = 10 - filledCount;
            const barString = "█".repeat(filledCount) + "░".repeat(emptyCount);

            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-50" />
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                        <FaBullseye className="text-green-600 text-xs" /> {goal.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        Target Date: {new Date(goal.targetDate).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-slate-350 hover:text-red-500 p-1.5 transition-colors"
                      title="Remove Goal"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Saved: ₹{goal.currentAmount.toLocaleString("en-IN")}</span>
                      <span>Target: ₹{goal.targetAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black tracking-widest text-green-600 font-mono">
                        {barString}
                      </span>
                      <span className="text-xs font-extrabold text-slate-800">{percent}%</span>
                    </div>
                  </div>

                  {/* Goal SIP Insights */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/60 text-[10px] font-semibold space-y-1.5 text-slate-650">
                    <p className="flex justify-between">
                      <span>Time Remaining:</span>
                      <span className="font-bold text-slate-800">{yearsLeft} Years</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Required SIP (@12%):</span>
                      <span className="font-bold text-slate-800">₹{requiredSIP.toLocaleString("en-IN")}/mo</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Your Current SIP:</span>
                      <span className="font-bold text-slate-800">₹{currentSIP.toLocaleString("en-IN")}/mo</span>
                    </p>
                    {isDeficitSIP && deficit > 0 && (
                      <div className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-1.5 mt-2 leading-relaxed">
                        ⚠️ Increase monthly SIP by **₹{(requiredSIP - currentSIP).toLocaleString("en-IN")}** to reach target on time!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon="🎯"
              title="No Financial Goals"
              description="Create your first goal and start planning your future."
              buttonText="Create Goal"
              buttonLink="/goals"
            />
          </div>
        )}
      </div>

      {/* SIP Calculator widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            <FaCalculator className="text-blue-500" /> SIP Calculator
          </h2>
          <div className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1.5">Target Capital (₹)</label>
                <input
                  type="number"
                  value={sipCalc.target}
                  onChange={(e) => setSipCalc({ ...sipCalc, target: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1.5">Time Horizon (Years)</label>
                <input
                  type="number"
                  value={sipCalc.years}
                  onChange={(e) => setSipCalc({ ...sipCalc, years: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1.5">Expected Return (%)</label>
                <input
                  type="number"
                  value={sipCalc.expectedReturn}
                  onChange={(e) => setSipCalc({ ...sipCalc, expectedReturn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/60 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">Estimated Monthly Deposit</h4>
                <p className="text-[10px] text-slate-500 font-bold">Assuming interest compounds monthly</p>
              </div>
              <span className="text-2xl font-black text-blue-700">
                ₹{Math.round(currentSipRequired).toLocaleString("en-IN")}/mo
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
            <FaPiggyBank className="text-amber-500" /> Goal Insights
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Planning with compound returns simplifies wealth creation. Increasing your monthly investment early by even small fractions (10-15% step-ups) drastically curtails time horizons.
          </p>
          <div className="border-t border-slate-100 pt-4 text-xs font-bold text-slate-700 space-y-2">
            <p className="flex justify-between">
              <span>Goal Target:</span>
              <span className="text-slate-800 font-black">₹{(parseFloat(sipCalc.target) || 0).toLocaleString("en-IN")}</span>
            </p>
            <p className="flex justify-between">
              <span>Required Monthly Deposit:</span>
              <span className="text-blue-600 font-black">₹{Math.round(currentSipRequired).toLocaleString("en-IN")}</span>
            </p>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteGoalId !== null}
        title="Delete Goal"
        message="This financial goal will be permanently deleted."
        confirmText="Delete"
        confirmButtonColor="bg-red-650 hover:bg-red-700 shadow-red-600/10"
        onConfirm={executeDeleteGoal}
        onCancel={() => setDeleteGoalId(null)}
        icon="🎯"
      />
    </Layout>
  );
}

export default Goals;

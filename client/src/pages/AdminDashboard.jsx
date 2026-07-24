import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/layout";
import api from "../services/api";
import { FaUsers, FaCoins, FaReceipt, FaTrash, FaDownload, FaBrain } from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [aiUsage, setAiUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, txsRes, aiRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/transactions"),
        api.get("/admin/ai-usage")
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setTransactions(txsRes.data.transactions || []);
      setAiUsage(aiRes.data.aiUsage);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load admin panel data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleDisable = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/disable`);
      toast.success(res.data.message);
      fetchAdminData();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to alter status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Permanently delete this user account and all their records?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchAdminData();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete user");
    }
  };

  // Helper to compile and trigger downloads of CSV files
  const downloadCSV = (headers, dataRows, filename) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...dataRows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filename} download initiated`);
  };

  const exportUsers = () => {
    const headers = ["User ID", "Full Name", "Email", "Role", "Disabled Status"];
    const rows = users.map((u) => [u.id, u.fullName, u.email, u.role, u.isDisabled ? "Disabled" : "Active"]);
    downloadCSV(headers, rows, "users_report.csv");
  };

  const exportTransactions = () => {
    const headers = ["Tx ID", "User Name", "Symbol", "Type", "Quantity", "Price", "Total", "Date"];
    const rows = transactions.map((t) => [
      t.id,
      t.user?.fullName || "N/A",
      t.symbol,
      t.type,
      t.quantity,
      t.price,
      t.total,
      new Date(t.createdAt).toLocaleDateString()
    ]);
    downloadCSV(headers, rows, "transactions_report.csv");
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            🛡️ Administrative Control Room
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Oversee user databases, transaction flows, and AI usage metrics.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 text-xs py-12 font-medium">Loading control room stats...</div>
      ) : (
        <div className="space-y-8">
          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaUsers className="text-lg" /></div>
              <div>
                <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Total Users</h4>
                <p className="text-2xl font-black text-slate-800 mt-0.5">{stats?.totalUsers}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><FaUsers className="text-lg" /></div>
              <div>
                <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Active Users</h4>
                <p className="text-2xl font-black text-slate-800 mt-0.5">{stats?.activeUsers}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FaCoins className="text-lg" /></div>
              <div>
                <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Tx Logs</h4>
                <p className="text-2xl font-black text-slate-800 mt-0.5">{stats?.totalTransactions}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-605 rounded-xl"><FaCoins className="text-lg" /></div>
              <div>
                <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Holding Wealth</h4>
                <p className="text-xl font-black text-slate-800 mt-0.5">₹{(stats?.totalPortfolioValue || 0).toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-650 rounded-xl"><FaReceipt className="text-lg" /></div>
              <div>
                <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Outflows Logged</h4>
                <p className="text-xl font-black text-slate-800 mt-0.5">₹{(stats?.totalExpensesValue || 0).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* AI Usage & CSV Downloads */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <FaBrain className="text-violet-500 text-xs" /> AI Usage Stats
              </h3>
              <div className="space-y-3 text-xs font-bold text-slate-650">
                <p className="flex justify-between"><span>Queries Today:</span><span className="text-slate-800 font-extrabold">{aiUsage?.queriesToday}</span></p>
                <p className="flex justify-between"><span>Avg Response Time:</span><span className="text-slate-800 font-extrabold">{aiUsage?.averageResponseTime}s</span></p>
                <p className="flex justify-between"><span>Most Asked Query:</span><span className="text-slate-800 font-extrabold">"{aiUsage?.mostAskedQuestion}"</span></p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <FaDownload className="text-blue-500 text-xs" /> Administrative Exports
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={exportUsers} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-200 text-xs flex items-center gap-2 justify-center">
                  <FaDownload /> Export Users
                </button>
                <button onClick={exportTransactions} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-200 text-xs flex items-center gap-2 justify-center">
                  <FaDownload /> Export Transactions
                </button>
              </div>
            </div>
          </div>

          {/* User database management */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                👥 Registered Users Catalog
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-650">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] text-slate-400 uppercase font-black">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Permission Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40">
                      <td className="py-4 px-6 font-extrabold text-slate-800">{u.fullName}</td>
                      <td className="py-4 px-6 font-bold">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${u.role === "ADMIN" ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${u.isDisabled ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
                          {u.isDisabled ? "Disabled" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleToggleDisable(u.id)}
                          className={`font-bold text-[10px] py-1 px-2.5 rounded-lg border transition ${
                            u.isDisabled
                              ? "border-green-200 text-green-600 hover:bg-green-50"
                              : "border-amber-200 text-amber-600 hover:bg-amber-50"
                          }`}
                        >
                          {u.isDisabled ? "Enable" : "Disable"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="border border-red-200 text-red-650 hover:bg-red-50 font-bold text-[10px] py-1 px-2.5 rounded-lg transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default AdminDashboard;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      
      if (res.data.user.role !== "ADMIN") {
        toast.error("Access Denied: Admin authorization required");
        setLoading(false);
        return;
      }
      
      // Save credentials via auth hook context
      login(res.data.token, res.data.user);
      toast.success("Admin Authorization Granted");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-3xl max-w-md w-full p-8 border border-slate-700/60 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            🛡️ Admin Portal
          </h1>
          <p className="text-slate-400 text-xs font-semibold">
            TradeSphere AI Administrative Gatekeeper
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-black text-slate-350">
          <div>
            <label className="block mb-1.5 font-bold uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tradesphere.com"
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 font-bold"
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 font-bold uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 font-bold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-650 hover:bg-red-700 disabled:bg-slate-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all"
          >
            {loading ? "Authenticating..." : "Authorize Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

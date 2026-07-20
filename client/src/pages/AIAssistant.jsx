import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaRobot, FaSearch, FaChartBar } from "react-icons/fa";

import Layout from "../components/layout/layout";
import AIResponse from "../components/ai/AIResponse";
import api from "../services/api";

function AIAssistant() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [balance, setBalance] = useState(0);

  // Fetch Wallet Balance
  const fetchBalance = useCallback(async () => {
    try {
      const res = await api.get("/transactions/balance");
      setBalance(res.data.balance);
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Handle custom question ask (POST /api/ai/analyze-stock)
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setQuery(question);
    setResponse("");

    try {
      const res = await api.post("/ai/analyze-stock", { question });
      setResponse(res.data.answer || "");
    } catch (error) {
      console.error("Stock analysis error:", error);
      toast.error(error.response?.data?.message || "Failed to analyze stock");
      setResponse("Failed to generate response. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handle portfolio analysis request (GET /api/ai/portfolio-analysis)
  const handleAnalyzePortfolio = async () => {
    if (loading) return;

    setLoading(true);
    setQuery("Analyze My Portfolio");
    setResponse("");

    try {
      const res = await api.get("/ai/portfolio-analysis");
      setResponse(res.data.analysis || "");
    } catch (error) {
      console.error("Portfolio analysis error:", error);
      toast.error(error.response?.data?.message || "Failed to analyze portfolio");
      setResponse(
        error.response?.status === 400
          ? "Your portfolio is currently empty. Buy some stocks in the Market page to generate an AI review."
          : "Failed to generate response. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            AI Financial Advisor
          </h1>
          <p className="text-slate-500 mt-1">
            Consult the AI advisor for detailed stock analysis or a complete portfolio allocation review
          </p>
        </div>
        {/* Wallet Balance Display */}
        <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Wallet Balance
          </span>
          <span className="text-2xl font-black text-slate-800 mt-1">
            ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Controls Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl border border-green-100">
                <FaRobot size={22} className="animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Ask AI</h2>
            </div>

            {/* Custom Question form */}
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ask anything about investing
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Should I buy Apple?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-4 pr-10 py-3.5 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="absolute right-3 text-slate-400 hover:text-green-600 p-1.5 transition-colors disabled:opacity-30"
                  >
                    <FaSearch size={14} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Ask
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center my-6">
              <hr className="w-full border-slate-100" />
              <span className="absolute bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Portfolio analysis button */}
            <button
              onClick={handleAnalyzePortfolio}
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-4 rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <FaChartBar size={16} />
              <span>Analyze My Portfolio</span>
            </button>
          </div>
        </div>

        {/* Right Side: Response Card */}
        <div className="lg:col-span-2">
          <AIResponse response={response} loading={loading} query={query} />
        </div>
      </div>
    </Layout>
  );
}

export default AIAssistant;

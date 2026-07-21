import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

import Layout from "../components/layout/layout";
import api from "../services/api";

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your TradeSphere AI Financial Advisor. Ask me anything about stock investments, diversification metrics, or your current portfolio balance assets.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [balance, setBalance] = useState(0);

  const chatEndRef = useRef(null);

  // Suggested questions list
  const suggestedQuestions = [
    "How is my portfolio performing?",
    "Should I buy more AAPL?",
    "Explain P/E ratio.",
    "What is diversification?",
    "How much cash do I have?",
    "Which stock is my best performer?",
    "Summarize today's portfolio.",
  ];

  // Fetch Wallet Balance
  const fetchBalance = async () => {
    try {
      const res = await api.get("/transactions/balance");
      setBalance(res.data.balance || 0);
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // Auto Scroll logic
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Append user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      // Pass query history alongside current question to backend
      const response = await api.post("/ai/analyze-stock", {
        question: textToSend,
        history: messages.slice(-10), // Send last 10 messages for conversational context
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer || "I could not analyze that query.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      toast.error(error.response?.data?.message || "Failed to generate AI response");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to compile AI insights. Please check your backend connection.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
      fetchBalance();
    }
  };

  // Light Custom Markdown Parser
  const parseMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-800 mt-3 mb-1">
            {line.slice(4)}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-slate-800 mt-4 mb-2">
            {line.slice(3)}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2 key={idx} className="text-lg font-black text-slate-900 mt-5 mb-3">
            {line.slice(2)}
          </h2>
        );
      }
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs font-semibold text-slate-650 leading-relaxed mb-1">
            {line.slice(2)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs font-semibold text-slate-655 leading-relaxed mb-1">
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      // Check for inline bold formatting: **text**
      const parts = line.split(" ");
      const renderedParts = parts.map((part, pidx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pidx} className="font-extrabold text-slate-800">{part.slice(2, -2)} </strong>;
        }
        return part + " ";
      });

      return (
        <p key={idx} className="text-xs font-semibold text-slate-600 leading-relaxed mb-1.5">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <Layout>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            🤖 TradeSphere AI
          </h1>
          <p className="text-slate-500 mt-1">
            Chat with our intelligent engine about your portfolio balance, market trends, or strategic allocations
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-210px)] min-h-[500px]">
        {/* Suggested Questions Panel */}
        <div className="lg:col-span-1 flex flex-col bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-full overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <span>💡</span> Suggested Questions
          </h3>
          <div className="flex flex-col gap-2.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="text-left text-xs font-bold text-slate-650 bg-slate-50 border border-slate-150 hover:bg-green-50 hover:text-green-700 hover:border-green-150 px-4 py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Conversation pane */}
        <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm h-full overflow-hidden">
          {/* Scrollable messages segment */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div key={idx} className={`flex items-start gap-4.5 ${isUser ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${
                      isUser
                        ? "bg-slate-800 text-white border-transparent"
                        : "bg-green-50 text-green-600 border-green-100"
                    }`}
                  >
                    {isUser ? <FaUser size={13} /> : <FaRobot size={15} />}
                  </div>

                  {/* Message Bubble wrapper */}
                  <div className={`max-w-[85%] ${isUser ? "text-right" : "text-left"}`}>
                    <div
                      className={`inline-block p-4.5 rounded-2xl text-slate-800 ${
                        isUser
                          ? "bg-slate-100 rounded-tr-none text-left"
                          : "bg-green-50/45 border border-green-50 rounded-tl-none text-left"
                      }`}
                    >
                      {isUser ? <p className="text-xs font-semibold text-slate-700">{m.content}</p> : parseMarkdown(m.content)}
                    </div>
                    <span className="block text-[10px] font-bold text-slate-400 mt-1 px-1">
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Thinking / Loading Animation */}
            {loading && (
              <div className="flex items-start gap-4.5">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-green-100 bg-green-50 text-green-600 shadow-sm">
                  <FaRobot size={15} />
                </div>
                <div>
                  <div className="inline-block p-4 px-5 rounded-2xl rounded-tl-none bg-green-50/45 border border-green-50">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-500 animate-pulse">AI is thinking</span>
                      <div className="flex gap-1 items-center ml-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form input trigger */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(question);
            }}
            className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3.5"
          >
            <input
              type="text"
              placeholder="Ask TradeSphere AI anything about your investments..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              className="flex-1 bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold p-3.5 rounded-xl shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
            >
              <FaPaperPlane size={12} />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AIAssistant;

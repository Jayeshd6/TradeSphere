import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";

function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications");
      const unreads = (res.data.notifications || []).filter((n) => !n.isRead).length;
      setUnreadCount(unreads);
    } catch (e) {
      console.error("Navbar unread notifications count error:", e);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    window.addEventListener("notifications_updated", fetchUnreadCount);
    return () => window.removeEventListener("notifications_updated", fetchUnreadCount);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between">
      {/* Left Section: Menu Toggle + Brand Text */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-650 hover:bg-slate-50 transition-all text-base"
        >
          <FaBars />
        </button>
        <span className="lg:hidden text-base font-black text-slate-800 tracking-tight">
          TradeSphere
        </span>

        {/* Desktop Search Bar */}
        <div className="relative w-80 xl:w-96 hidden md:block">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-xs"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notification Bell */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-xl hover:bg-slate-50 transition-all"
        >
          <FaBell className="text-xl text-slate-600 hover:text-green-500 transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[14px] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            onClick={() => navigate("/profile")}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm md:text-lg cursor-pointer"
          >
            {user?.fullName?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Name & Role (Hidden on mobile) */}
          <div className="hidden sm:block text-left">
            <p className="font-extrabold text-xs text-slate-800">
              {user?.fullName || "User"}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Investor
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);
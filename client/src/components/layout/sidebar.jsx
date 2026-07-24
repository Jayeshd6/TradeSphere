import { useEffect, useState, memo } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaChartPie,
  FaWallet,
  FaRobot,
  FaCog,
  FaSignOutAlt,
  FaChartLine,
  FaStore,
  FaStar,
  FaReceipt,
  FaBell,
  FaBullseye,
  FaShieldAlt,
} from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import api from "../../services/api";

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications");
      const unreads = (res.data.notifications || []).filter((n) => !n.isRead).length;
      setUnreadCount(unreads);
    } catch (e) {
      console.error("Sidebar unread notifications count error:", e);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    window.addEventListener("notifications_updated", fetchUnreadCount);
    return () => window.removeEventListener("notifications_updated", fetchUnreadCount);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      name: "Portfolio",
      icon: <FaChartPie />,
      path: "/portfolio",
    },
    {
      name: "Market",
      icon: <FaStore />,
      path: "/market",
    },
    {
      name: "Watchlist",
      icon: <FaStar />,
      path: "/watchlist",
    },
    {
      name: "Wallet",
      icon: <FaWallet />,
      path: "/portfolio",
    },
    {
      name: "Expenses",
      icon: <FaReceipt />,
      path: "/expenses",
    },
    {
      name: "Goals",
      icon: <FaBullseye />,
      path: "/goals",
    },
    {
      name: "Transactions",
      icon: <FaChartLine />,
      path: "/transactions",
    },
    {
      name: "Notifications",
      icon: <FaBell />,
      path: "/notifications",
      badge: unreadCount,
    },
    {
      name: "AI Assistant",
      icon: <FaRobot />,
      path: "/ai",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  if (user?.role === "ADMIN") {
    menuItems.push({
      name: "Admin",
      icon: <FaShieldAlt className="text-red-500" />,
      path: "/admin/dashboard"
    });
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 z-50 shadow-2xl lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo and close buttons */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-400">
              TradeSphere AI
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Smart Investing & Finance
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1.5 transition-all duration-200 text-xs font-bold ${
                  isActive
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/10"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="text-sm">{item.icon}</span>
              <span className="flex-1 flex justify-between items-center">
                <span>{item.name}</span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                    {item.badge}
                  </span>
                )}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:bg-red-500 hover:text-white transition-all duration-200 text-xs font-bold"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default memo(Sidebar);
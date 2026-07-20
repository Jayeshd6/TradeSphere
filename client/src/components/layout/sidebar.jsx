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
} from "react-icons/fa";

import useAuth from "../../hooks/useAuth";

function Sidebar() {
  const { logout } = useAuth();

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
      name: "Expenses",
      icon: <FaWallet />,
      path: "/expenses",
    },
    {
      name: "Paper Trading",
      icon: <FaChartLine />,
      path: "/paper-trading",
    },
    {
      name: "AI Assistant",
      icon: <FaRobot />,
      path: "/ai",
    },
    {
      name: "Analytics",
      icon: <FaChartPie />,
      path: "/analytics",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-green-400">
          TradeSphere AI
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Smart Investing & Finance
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                isActive
                  ? "bg-green-500 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>

            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg" />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
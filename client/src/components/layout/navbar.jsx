import { FaBell, FaSearch } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">

      {/* Search Bar */}
      <div className="relative w-96">

        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          placeholder="Search stocks..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button className="relative">

          <FaBell className="text-2xl text-slate-600 hover:text-green-500 transition" />

          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>

        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg">

            {user?.fullName?.charAt(0).toUpperCase() || "U"}

          </div>

          {/* Name */}
          <div>

            <p className="font-semibold text-slate-800">
              {user?.fullName || "User"}
            </p>

            <p className="text-sm text-slate-500">
              Investor
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;
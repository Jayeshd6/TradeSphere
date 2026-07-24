import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-6">
      <h1 className="text-8xl font-black text-green-600 tracking-tighter animate-pulse">
        404
      </h1>
      <h2 className="text-2xl font-black mt-4 text-slate-800">
        Page Not Found
      </h2>
      <p className="text-slate-500 mt-2 text-xs font-semibold text-center max-w-xs leading-relaxed">
        The page you are looking for does not exist or has been moved to a different coordinate.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-green-600/10 transition-all text-xs"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
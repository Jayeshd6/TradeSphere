import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an uncaught exception:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-6">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-3xl mb-4 shadow-sm animate-pulse">
            🚨
          </div>
          <h1 className="text-xl font-black text-slate-800">
            Something went wrong.
          </h1>
          <p className="text-slate-500 mt-2 text-xs font-semibold text-center max-w-xs leading-relaxed">
            The application experienced a client-side execution crash. Reloading the page may resolve it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-green-600/10 transition-all text-xs"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

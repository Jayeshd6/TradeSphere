function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-md mx-auto my-8 animate-fadeIn">
      <div className="w-12 h-12 rounded-full bg-red-100/50 flex items-center justify-center text-red-650 mx-auto text-xl mb-3">
        ⚠️
      </div>
      <h2 className="text-red-700 text-lg font-black tracking-tight">
        Something went wrong
      </h2>
      <p className="text-slate-500 mt-2 text-xs font-semibold leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-red-650/10 transition-all text-xs"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

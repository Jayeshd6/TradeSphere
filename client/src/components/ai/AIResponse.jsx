import { FaRobot } from "react-icons/fa";

function AIResponse({ response, loading, query }) {
  // Custom Markdown Parser to avoid external library dependencies and load instantly
  const renderFormattedText = (text = "") => {
    if (!text) return null;

    return text.split("\n").map((line, idx) => {
      let cleanLine = line.trim();
      if (!cleanLine) return <div key={idx} className="h-2" />;

      // Header h2 (## Portfolio Summary)
      if (cleanLine.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl font-extrabold text-slate-800 mt-6 mb-3 first:mt-0 uppercase tracking-wide border-b border-slate-100 pb-2">
            {cleanLine.slice(3)}
          </h2>
        );
      }

      // Header h3 (### Company Overview)
      if (cleanLine.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg font-black text-slate-800 mt-6 mb-3 first:mt-0 uppercase tracking-wide border-b border-slate-50 pb-2">
            {cleanLine.slice(4)}
          </h3>
        );
      }

      // Bold-only line (**Financial Health**)
      if (cleanLine.startsWith("**") && cleanLine.endsWith("**")) {
        return (
          <h4 key={idx} className="text-sm font-extrabold text-slate-800 mt-4 mb-2">
            {cleanLine.slice(2, -2)}
          </h4>
        );
      }

      // Horizontal lines
      if (cleanLine === "---") {
        return <hr key={idx} className="my-5 border-slate-100" />;
      }

      // Checklist / Strengths (✓ Strong demand)
      if (cleanLine.startsWith("✓ ")) {
        return (
          <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 mb-2 font-semibold">
            <span className="text-green-600 bg-green-50 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
            <span className="pt-0.5">{cleanLine.slice(2)}</span>
          </div>
        );
      }

      // Risks / Warning bullet points (• High valuation)
      if (cleanLine.startsWith("• ") || cleanLine.startsWith("• ⚠️ ")) {
        const hasWarning = cleanLine.includes("⚠️");
        const cleanContent = hasWarning 
          ? cleanLine.substring(cleanLine.indexOf("⚠️") + 2).trim() 
          : cleanLine.slice(2);
        
        return (
          <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 mb-2 font-semibold">
            <span className="text-red-500 bg-red-50 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">!</span>
            <span className="pt-0.5">{cleanContent}</span>
          </div>
        );
      }

      // Standard list items (- Item description)
      if (cleanLine.startsWith("- ") || cleanLine.startsWith("* ")) {
        let content = cleanLine.slice(2);

        // Check if list item contains **bolded text**: details
        if (content.startsWith("**") && content.includes("**")) {
          const boldMatch = content.match(/^\*\*(.*?)\*\*(.*)/);
          if (boldMatch) {
            return (
              <li key={idx} className="list-disc ml-5 text-sm text-slate-600 mb-1.5 leading-relaxed">
                <strong className="text-slate-800 font-extrabold">{boldMatch[1]}</strong>
                {boldMatch[2]}
              </li>
            );
          }
        }

        return (
          <li key={idx} className="list-disc ml-5 text-sm text-slate-600 mb-1.5 leading-relaxed">
            {content}
          </li>
        );
      }

      // Check if line contains bold parts inside (e.g. **Current Price:** ₹15,250)
      if (cleanLine.startsWith("**") && cleanLine.includes("** ")) {
        const titleMatch = cleanLine.match(/^\*\*(.*?)\*\*(.*)/);
        if (titleMatch) {
          return (
            <p key={idx} className="text-sm text-slate-600 leading-relaxed mb-3">
              <strong className="text-slate-800 font-extrabold">{titleMatch[1]}</strong>
              {titleMatch[2]}
            </p>
          );
        }
      }

      // Normal text paragraphs
      return (
        <p key={idx} className="text-sm text-slate-600 leading-relaxed mb-3">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[250px]">
      <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>Response Panel</span>
        </h3>
        {query && (
          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-md border tracking-wider">
            Query: "{query}"
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          {/* Pulsing loading animation */}
          <div className="relative">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100 animate-bounce">
              <FaRobot size={24} />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-700">AI Advisor is computing...</p>
            <p className="text-xs text-slate-400 mt-1">Analyzing database balances and stock data</p>
          </div>
        </div>
      ) : response ? (
        <div className="prose prose-slate max-w-none text-slate-600">
          {renderFormattedText(response)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 text-center text-slate-400">
          <span className="text-4xl mb-3">🤖</span>
          <p className="text-sm font-bold text-slate-500">Awaiting your questions</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Select a preset question above or enter a custom prompt in the input field to consult the AI advisor.
          </p>
        </div>
      )}
    </div>
  );
}

export default AIResponse;

import { useEffect } from "react";
import { FaCircleInfo } from "react-icons/fa6";

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "bg-red-650 hover:bg-red-700 shadow-red-600/10",
  onConfirm,
  onCancel,
  icon = "⚠️",
}) {
  // Lock scroll on background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-slate-100/80 flex flex-col items-center text-center transform scale-100 transition-transform duration-200">
        {/* Visual Icon */}
        <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl mb-4 shadow-sm animate-bounce">
          {icon}
        </div>

        {/* Title */}
        <h2 className="text-lg font-black text-slate-800 tracking-tight">
          {title}
        </h2>

        {/* Message */}
        <p className="text-slate-500 mt-2 text-xs font-semibold max-w-xs leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-extrabold text-xs transition-all"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-lg transition-all ${confirmButtonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

import { FaEdit, FaTrash } from "react-icons/fa";

const CATEGORY_COLORS = {
  "Food": "#10B981",         // Emerald
  "Transport": "#3B82F6",    // Blue
  "Rent": "#EF4444",         // Red/Rose
  "Shopping": "#F59E0B",      // Amber
  "Entertainment": "#8B5CF6",// Violet
  "Healthcare": "#EC4899",   // Pink
  "Education": "#6366F1",    // Indigo
  "Utilities": "#06B6D4",    // Cyan
  "Bills": "#14B8A6",        // Teal
  "Others": "#64748B"        // Slate
};

const CATEGORY_ICONS = {
  "Food": "🍔",
  "Transport": "🚕",
  "Rent": "🏠",
  "Shopping": "🛒",
  "Entertainment": "🎬",
  "Healthcare": "💊",
  "Education": "📚",
  "Utilities": "💡",
  "Bills": "📱",
  "Others": "📦"
};

function ExpenseCard({ expense, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-bold text-slate-800">{expense.title}</td>
      <td className="px-6 py-4 font-extrabold text-red-600">
        ₹{expense.amount.toLocaleString("en-IN")}
      </td>
      <td className="px-6 py-4">
        <span
          className="px-2.5 py-1 rounded-md text-[10px] font-bold border"
          style={{
            backgroundColor: `${CATEGORY_COLORS[expense.category]}10`,
            color: CATEGORY_COLORS[expense.category],
            borderColor: `${CATEGORY_COLORS[expense.category]}20`
          }}
        >
          {CATEGORY_ICONS[expense.category]} {expense.category}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-500">
        {new Date(expense.expenseDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })}
      </td>
      <td className="px-6 py-4">
        <span className="bg-slate-100 text-slate-650 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
          {expense.paymentMethod || "UPI"}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-400 font-medium max-w-[200px] truncate">
        {expense.notes || "—"}
      </td>
      <td className="px-6 py-4 text-right flex justify-end gap-3">
        <button
          onClick={() => onEdit(expense)}
          className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
          title="Edit Expense"
        >
          <FaEdit className="text-sm" />
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-red-400 hover:text-red-600 p-1 transition-colors"
          title="Delete Expense"
        >
          <FaTrash className="text-sm" />
        </button>
      </td>
    </tr>
  );
}

export default ExpenseCard;

import toast from "react-hot-toast";
import api from "../../services/api";

function DeleteExpenseButton({ expenseId, onSuccess }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this expense?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/expenses/${expenseId}`);
      toast.success("Expense deleted");
      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-650 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors"
    >
      Delete
    </button>
  );
}

export default DeleteExpenseButton;

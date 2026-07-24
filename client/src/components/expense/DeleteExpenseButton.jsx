import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import ConfirmModal from "../common/ConfirmModal";

function DeleteExpenseButton({ expenseId, onSuccess }) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${expenseId}`);
      toast.success("Expense deleted successfully");
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-500 hover:bg-red-650 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-colors"
      >
        Delete
      </button>

      <ConfirmModal
        isOpen={open}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        confirmButtonColor="bg-red-600 hover:bg-red-750 shadow-red-600/10"
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        icon="🗑️"
      />
    </>
  );
}

export default DeleteExpenseButton;

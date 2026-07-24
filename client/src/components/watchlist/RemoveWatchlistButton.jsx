import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import ConfirmModal from "../common/ConfirmModal";

function RemoveWatchlistButton({ symbol, refresh }) {
  const [open, setOpen] = useState(false);

  const handleRemove = async () => {
    try {
      await api.delete(`/watchlist/${symbol}`);
      toast.success("Removed from watchlist successfully");
      setOpen(false);
      refresh();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to remove stock"
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
      >
        Remove
      </button>

      <ConfirmModal
        isOpen={open}
        title="Remove Stock"
        message={`Are you sure you want to remove ${symbol} from your watchlist?`}
        confirmText="Remove"
        confirmButtonColor="bg-red-600 hover:bg-red-750 shadow-red-600/10"
        onConfirm={handleRemove}
        onCancel={() => setOpen(false)}
        icon="⭐"
      />
    </>
  );
}

export default RemoveWatchlistButton;

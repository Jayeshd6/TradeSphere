import toast from "react-hot-toast";
import api from "../../services/api";

function RemoveWatchlistButton({ symbol, refresh }) {

  const handleRemove = async () => {

    const confirmRemove = window.confirm(
      `Remove ${symbol} from your watchlist?`
    );

    if (!confirmRemove) return;

    try {

      await api.delete(`/watchlist/${symbol}`);

      toast.success("Removed from watchlist");

      refresh();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to remove stock"
      );

    }

  };

  return (
    <button
      onClick={handleRemove}
      className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
    >
      Remove
    </button>
  );
}

export default RemoveWatchlistButton;

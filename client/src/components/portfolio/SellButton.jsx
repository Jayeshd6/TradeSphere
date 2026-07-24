import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import ConfirmModal from "../common/ConfirmModal";

function SellButton({ portfolio, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!quantity || Number(quantity) <= 0) {
            return toast.error("Enter a valid quantity");
        }

        if (Number(quantity) > portfolio.quantity) {
            return toast.error("Quantity exceeds available shares");
        }

        setShowConfirm(true);
    };

    const executeSell = async () => {
        try {
            setLoading(true);

            await api.post("/transactions/sell", {
                symbol: portfolio.symbol,
                quantity: Number(quantity),
            });

            toast.success("Stock sold successfully");

            setShowConfirm(false);
            setOpen(false);
            setQuantity("");

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to sell stock"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Sell Button */}
            <button
                onClick={() => setOpen(true)}
                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
            >
                Sell Stock
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                        <h2 className="text-2xl font-bold mb-6">
                            Sell {portfolio.symbol}
                        </h2>

                        <form
                            onSubmit={handleFormSubmit}
                            className="space-y-5"
                        >

                            {/* Available Quantity */}
                            <div>
                                <p className="text-slate-500 text-sm">
                                    Available Quantity
                                </p>

                                <h3 className="text-xl font-bold">
                                    {portfolio.quantity}
                                </h3>
                            </div>

                            {/* Current Price */}
                            <div>
                                <p className="text-slate-500 text-sm">
                                    Current Price
                                </p>

                                <h3 className="text-xl font-bold text-blue-600">
                                    ₹{portfolio.currentPrice.toFixed(2)}
                                </h3>
                            </div>

                            {/* Quantity */}
                            <div>

                                <label className="block mb-2 font-medium">
                                    Quantity to Sell
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max={portfolio.quantity}
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Enter quantity"
                                />

                            </div>

                            {/* Total Receive */}
                            {quantity && (
                                <div className="bg-green-50 rounded-lg p-4">

                                    <p className="text-green-700 font-semibold">
                                        Total Receive
                                    </p>

                                    <h2 className="text-2xl font-bold text-green-600">
                                        ₹
                                        {(
                                            Number(quantity) *
                                            portfolio.currentPrice
                                        ).toLocaleString("en-IN")}
                                    </h2>

                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        setQuantity("");
                                    }}
                                    className="px-5 py-2 rounded-lg border"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                                >
                                    {loading
                                        ? "Selling..."
                                        : "Sell"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            <ConfirmModal
                isOpen={showConfirm}
                title="Sell Stock"
                message={`Are you sure you want to sell ${quantity} shares of ${portfolio.symbol}?`}
                confirmText="Sell"
                confirmButtonColor="bg-orange-500 hover:bg-orange-600 shadow-orange-500/10"
                onConfirm={executeSell}
                onCancel={() => setShowConfirm(false)}
                icon="📈"
            />
        </>
    );
}

export default SellButton;
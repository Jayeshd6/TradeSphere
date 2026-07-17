import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import api from "../../services/api";

function SellStock({ portfolios, onStockSold }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post(
        "/transactions/sell",
        {
          symbol: data.symbol,
          quantity: Number(data.quantity),
          price: Number(data.price),
        }
      );

      toast.success(response.data.message);

      reset();

      // Refresh portfolio after selling
      onStockSold();

    } catch (error) {
      console.error("Sell Stock Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to sell stock"
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Sell Stock
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >

        {/* Stock Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Select Stock
          </label>

          <select
            {...register("symbol", {
              required: "Please select a stock",
            })}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-red-500"
          >
            <option value="">
              Select a stock
            </option>

            {portfolios.map((portfolio) => (
              <option
                key={portfolio.id}
                value={portfolio.symbol}
              >
                {portfolio.symbol} ({portfolio.quantity} shares)
              </option>
            ))}

          </select>

          {errors.symbol && (
            <p className="text-red-500 text-sm mt-1">
              {errors.symbol.message}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Quantity
          </label>

          <input
            type="number"
            placeholder="Enter quantity"
            {...register("quantity", {
              required: "Quantity is required",
              min: {
                value: 1,
                message: "Quantity must be at least 1",
              },
            })}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-red-500"
          />

          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Selling Price */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Selling Price
          </label>

          <input
            type="number"
            placeholder="Enter selling price"
            {...register("price", {
              required: "Selling price is required",
              min: {
                value: 0.01,
                message: "Price must be greater than 0",
              },
            })}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-red-500"
          />

          {errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Button */}
        <div className="md:col-span-2">

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? "Selling..." : "Sell Stock"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default SellStock;
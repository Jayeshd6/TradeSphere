import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import api from "../../services/api";

function BuyStock({ onStockBought }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/transactions/buy", {
        symbol: data.symbol.toUpperCase(),
        companyName: data.companyName,
        quantity: Number(data.quantity),
        price: Number(data.price),
      });

      toast.success(response.data.message);

      reset();

      // Refresh portfolio and transactions
      if (onStockBought) {
        onStockBought();
      }

    } catch (error) {
      console.error("Buy Stock Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to buy stock"
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Buy Stock
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >

        {/* Stock Symbol */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Stock Symbol
          </label>

          <input
            type="text"
            placeholder="Example: TCS"
            {...register("symbol", {
              required: "Stock symbol is required",
            })}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
          />

          {errors.symbol && (
            <p className="text-red-500 text-sm mt-1">
              {errors.symbol.message}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Company Name
          </label>

          <input
            type="text"
            placeholder="Example: Tata Consultancy Services"
            {...register("companyName", {
              required: "Company name is required",
            })}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
          />

          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.companyName.message}
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
            placeholder="Example: 10"
            {...register("quantity", {
              required: "Quantity is required",
              min: {
                value: 1,
                message: "Quantity must be at least 1",
              },
            })}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
          />

          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Price Per Share
          </label>

          <input
            type="number"
            placeholder="Example: 3450"
            {...register("price", {
              required: "Price is required",
              min: {
                value: 0.01,
                message: "Price must be greater than 0",
              },
            })}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
          />

          {errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Buy Button */}
        <div className="md:col-span-2">

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? "Buying..." : "Buy Stock"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default BuyStock;
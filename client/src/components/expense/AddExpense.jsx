import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function AddExpense({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    paymentMethod: "",
    notes: "",
    expenseDate: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/expenses", formData);
      toast.success("Expense added successfully");
      setFormData({
        title: "",
        amount: "",
        category: "",
        paymentMethod: "",
        notes: "",
        expenseDate: new Date().toISOString().split("T")[0],
      });
      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <h2 className="text-xl font-bold mb-6 text-slate-800">
        Add Expense
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold"
      >
        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={formData.title}
          onChange={handleChange}
          className="border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
          required
        >
          <option value="">Select Category</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>Utilities</option>
          <option>Rent</option>
          <option>Investment</option>
          <option>Others</option>
        </select>

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
        >
          <option value="">Payment Method</option>
          <option>Cash</option>
          <option>UPI</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Net Banking</option>
        </select>

        <input
          type="date"
          name="expenseDate"
          value={formData.expenseDate}
          onChange={handleChange}
          className="border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-slate-650"
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="border border-slate-200 rounded-xl p-3 md:col-span-2 focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold"
          rows="3"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded-xl py-3 md:col-span-2 font-bold transition-colors shadow-lg shadow-red-600/10"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}

export default AddExpense;

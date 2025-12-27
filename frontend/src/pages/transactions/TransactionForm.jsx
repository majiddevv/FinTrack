import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { transactionsAPI, categoriesAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { PAYMENT_METHODS } from "../../utils/helpers";
import { LoadingSpinner, PageHeader } from "../../components/common";
import toast from "react-hot-toast";
import { format } from "date-fns";

const TransactionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
    note: "",
    paymentMethod: "cash",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchTransaction();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTransaction = async () => {
    try {
      const response = await transactionsAPI.getOne(id);
      const t = response.data.data;
      setFormData({
        type: t.type,
        amount: t.amount.toString(),
        category: t.category._id,
        date: format(new Date(t.date), "yyyy-MM-dd"),
        note: t.note || "",
        paymentMethod: t.paymentMethod,
      });
    } catch (error) {
      toast.error("Failed to load transaction");
      navigate("/transactions");
    } finally {
      setFetching(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (isEdit) {
        await transactionsAPI.update(id, data);
        toast.success("Transaction updated successfully");
      } else {
        await transactionsAPI.create(data);
        toast.success("Transaction created successfully");
      }
      navigate("/transactions");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <PageHeader
        title={isEdit ? "Edit Transaction" : "Add Transaction"}
        subtitle={
          isEdit
            ? "Update transaction details"
            : "Record a new income or expense"
        }
        action={
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Type Toggle */}
        <div>
          <label className="label">Transaction Type</label>
          <div className="flex gap-4">
            {["expense", "income"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type, category: "" })}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  formData.type === type
                    ? type === "income"
                      ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500"
                      : "bg-red-100 text-red-700 ring-2 ring-red-500"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="label">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              {user?.currency === "USD"
                ? "$"
                : user?.currency === "EUR"
                ? "€"
                : "Rs."}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={`input pl-12 text-lg ${
                errors.amount ? "input-error" : ""
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="label">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className={`input ${errors.category ? "input-error" : ""}`}
          >
            <option value="">Select a category</option>
            {filteredCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`input ${errors.date ? "input-error" : ""}`}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Payment Method */}
        {user?.settings?.showPaymentMethod !== false && (
          <div>
            <label className="label">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className="input"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Note */}
        <div>
          <label className="label">Note (Optional)</label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="input resize-none"
            rows="3"
            placeholder="Add a note about this transaction..."
            maxLength={200}
          />
          <p className="text-xs text-gray-400 mt-1">
            {formData.note.length}/200 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEdit ? "Update" : "Save"} Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

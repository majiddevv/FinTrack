import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Target,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { budgetsAPI, categoriesAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  formatCurrency,
  getCurrentMonth,
  getMonthOptions,
} from "../utils/helpers";
import {
  LoadingSpinner,
  PageHeader,
  EmptyState,
  Modal,
  ConfirmDialog,
} from "../components/common";
import toast from "react-hot-toast";

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ category: "", amount: "" });
  const [errors, setErrors] = useState({});

  const monthOptions = getMonthOptions(12);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll("expense");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await budgetsAPI.getAll(selectedMonth);
      setBudgets(response.data.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBudget(null);
    setFormData({ category: "", amount: "" });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category._id,
      amount: budget.limitAmount.toString(),
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
    setFormData({ category: "", amount: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const data = {
        category: formData.category,
        limitAmount: parseFloat(formData.amount),
        month: selectedMonth,
      };

      if (editingBudget) {
        await budgetsAPI.update(editingBudget._id, data);
        toast.success("Budget updated successfully");
      } else {
        await budgetsAPI.create(data);
        toast.success("Budget created successfully");
      }
      fetchBudgets();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save budget");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await budgetsAPI.delete(deleteId);
      toast.success("Budget deleted successfully");
      fetchBudgets();
    } catch (error) {
      toast.error("Failed to delete budget");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStatusBadge = (percentage) => {
    if (percentage >= 100)
      return { text: "Over Budget", color: "bg-red-100 text-red-700" };
    if (percentage >= 80)
      return { text: "Near Limit", color: "bg-amber-100 text-amber-700" };
    return { text: "On Track", color: "bg-emerald-100 text-emerald-700" };
  };

  // Available categories (not already budgeted)
  const availableCategories = categories.filter(
    (cat) =>
      !budgets.some((b) => b.category._id === cat._id) ||
      editingBudget?.category._id === cat._id
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Budgets"
        subtitle="Set spending limits for your categories"
        action={
          <button
            onClick={openCreateModal}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Budget
          </button>
        }
      />

      {/* Month Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-400" />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="input w-auto"
        >
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Target}
            title="No budgets set"
            description="Create budgets to track your spending limits"
            action={
              <button onClick={openCreateModal} className="btn btn-primary">
                Create Budget
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const percentage = Math.round(
              (budget.spent / budget.limitAmount) * 100
            );
            const status = getStatusBadge(percentage);
            const remaining = budget.limitAmount - budget.spent;

            return (
              <div
                key={budget._id}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${budget.category.color}20` }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: budget.category.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {budget.category.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(budget)}
                      className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setDeleteId(budget._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Spent</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(budget.spent, user?.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="text-lg font-semibold text-gray-600">
                        {formatCurrency(budget.limitAmount, user?.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                        percentage
                      )}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{percentage}% used</span>
                    <span
                      className={
                        remaining >= 0 ? "text-emerald-600" : "text-red-600"
                      }
                    >
                      {remaining >= 0
                        ? `${formatCurrency(remaining, user?.currency)} left`
                        : `${formatCurrency(
                            Math.abs(remaining),
                            user?.currency
                          )} over`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBudget ? "Edit Budget" : "Create Budget"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`input ${errors.category ? "input-error" : ""}`}
              disabled={!!editingBudget}
            >
              <option value="">Select a category</option>
              {availableCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="label">Budget Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
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
                className={`input pl-12 ${errors.amount ? "input-error" : ""}`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex-1"
            >
              {saving ? "Saving..." : editingBudget ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default Budgets;

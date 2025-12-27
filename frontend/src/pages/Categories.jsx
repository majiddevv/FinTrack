import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Tags,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { categoriesAPI } from "../services/api";
import {
  LoadingSpinner,
  PageHeader,
  EmptyState,
  Modal,
  ConfirmDialog,
} from "../components/common";
import toast from "react-hot-toast";

const CATEGORY_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    color: "#6366f1",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const openCreateModal = (type = "expense") => {
    setEditingCategory(null);
    setFormData({ name: "", type, color: "#6366f1" });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", type: "expense", color: "#6366f1" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, formData);
        toast.success("Category updated successfully");
      } else {
        await categoriesAPI.create(formData);
        toast.success("Category created successfully");
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await categoriesAPI.delete(deleteId);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const CategoryCard = ({ category }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="font-medium text-gray-900">{category.name}</span>
        {category.isDefault && (
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            Default
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => openEditModal(category)}
          className="p-1.5 rounded-lg hover:bg-white"
        >
          <Pencil className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => setDeleteId(category._id)}
          className="p-1.5 rounded-lg hover:bg-white"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
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
        title="Categories"
        subtitle="Manage your income and expense categories"
        action={
          <button
            onClick={() => openCreateModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Categories
            </h3>
            <span className="ml-auto text-sm text-gray-500">
              {expenseCategories.length} categories
            </span>
          </div>
          <div className="space-y-2">
            {expenseCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No expense categories
              </p>
            ) : (
              expenseCategories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))
            )}
          </div>
          <button
            onClick={() => openCreateModal("expense")}
            className="w-full mt-4 py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors"
          >
            + Add Expense Category
          </button>
        </div>

        {/* Income Categories */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Income Categories
            </h3>
            <span className="ml-auto text-sm text-gray-500">
              {incomeCategories.length} categories
            </span>
          </div>
          <div className="space-y-2">
            {incomeCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No income categories
              </p>
            ) : (
              incomeCategories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))
            )}
          </div>
          <button
            onClick={() => openCreateModal("income")}
            className="w-full mt-4 py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors"
          >
            + Add Income Category
          </button>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`input ${errors.name ? "input-error" : ""}`}
              placeholder="e.g., Groceries"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {!editingCategory && (
            <div>
              <label className="label">Type</label>
              <div className="flex gap-4">
                {["expense", "income"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
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
          )}

          <div>
            <label className="label">Color</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    formData.color === color
                      ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
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
              {saving ? "Saving..." : editingCategory ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? You can only delete categories that are not used in any transactions."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default Categories;

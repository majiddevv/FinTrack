import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { transactionsAPI, categoriesAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  formatCurrency,
  formatDate,
  getCurrentMonth,
  getMonthOptions,
  PAYMENT_METHODS,
} from "../../utils/helpers";
import {
  LoadingSpinner,
  PageHeader,
  EmptyState,
  ConfirmDialog,
} from "../../components/common";
import toast from "react-hot-toast";

const TransactionList = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [filters, setFilters] = useState({
    month: getCurrentMonth(),
    type: "",
    categoryId: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const monthOptions = getMonthOptions(12);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionsAPI.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setTransactions(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages,
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await transactionsAPI.delete(deleteId);
      toast.success("Transaction deleted successfully");
      fetchTransactions();
    } catch (error) {
      toast.error("Failed to delete transaction");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getPaymentMethodLabel = (method) => {
    return PAYMENT_METHODS.find((m) => m.value === method)?.label || method;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Transactions"
        subtitle="Manage your income and expenses"
        action={
          <Link
            to="/transactions/new"
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Link>
        }
      />

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by note..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="input pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filters.month}
              onChange={(e) =>
                setFilters({ ...filters, month: e.target.value })
              }
              className="input w-auto"
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input w-auto"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filters.categoryId}
              onChange={(e) =>
                setFilters({ ...filters, categoryId: e.target.value })
              }
              className="input w-auto"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters or add a new transaction"
            action={
              <Link to="/transactions/new" className="btn btn-primary">
                Add Transaction
              </Link>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Note
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            t.type === "income"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.type === "income" ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {t.type}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: t.category?.color }}
                          />
                          <span className="text-sm text-gray-900">
                            {t.category?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            t.type === "income"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}
                          {formatCurrency(t.amount, user?.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {t.note || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getPaymentMethodLabel(t.paymentMethod)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/transactions/${t._id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-gray-100"
                          >
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(t._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                    disabled={pagination.page === 1}
                    className="btn btn-secondary p-2 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                    disabled={pagination.page === pagination.pages}
                    className="btn btn-secondary p-2 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default TransactionList;

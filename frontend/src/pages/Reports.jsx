import { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { reportsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  formatCurrency,
  getCurrentMonth,
  getMonthOptions,
  CHART_COLORS,
} from "../utils/helpers";
import { LoadingSpinner, PageHeader } from "../components/common";

const Reports = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [summary, setSummary] = useState({ income: 0, expense: 0, net: 0 });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("expense");

  const monthOptions = getMonthOptions(12);

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth, activeType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [summaryRes, breakdownRes, dailyRes] = await Promise.all([
        reportsAPI.getSummary(selectedMonth),
        reportsAPI.getCategoryBreakdown(selectedMonth, activeType),
        reportsAPI.getDailySpending(selectedMonth),
      ]);

      setSummary(summaryRes.data.data);
      setCategoryBreakdown(breakdownRes.data.data.breakdown);
      setDailyData(dailyRes.data.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      title: "Total Income",
      value: summary.income,
      icon: TrendingUp,
      color: "emerald",
    },
    {
      title: "Total Expenses",
      value: summary.expense,
      icon: TrendingDown,
      color: "red",
    },
    {
      title: "Net Savings",
      value: summary.net,
      icon: Wallet,
      color: summary.net >= 0 ? "primary" : "amber",
    },
  ];

  const topCategory = categoryBreakdown[0];
  const weeklyData = dailyData.reduce((acc, day, i) => {
    const weekIndex = Math.floor(i / 7);
    if (!acc[weekIndex])
      acc[weekIndex] = { week: `Week ${weekIndex + 1}`, income: 0, expense: 0 };
    acc[weekIndex].income += day.income;
    acc[weekIndex].expense += day.expense;
    return acc;
  }, []);

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
        title="Reports & Analytics"
        subtitle="Insights into your spending habits"
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p
                  className={`text-2xl font-bold ${
                    card.color === "emerald"
                      ? "text-emerald-600"
                      : card.color === "red"
                      ? "text-red-600"
                      : card.color === "amber"
                      ? "text-amber-600"
                      : "text-primary-600"
                  }`}
                >
                  {formatCurrency(card.value, user?.currency)}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  card.color === "emerald"
                    ? "bg-emerald-50"
                    : card.color === "red"
                    ? "bg-red-50"
                    : card.color === "amber"
                    ? "bg-amber-50"
                    : "bg-primary-50"
                }`}
              >
                <card.icon
                  className={`w-6 h-6 ${
                    card.color === "emerald"
                      ? "text-emerald-600"
                      : card.color === "red"
                      ? "text-red-600"
                      : card.color === "amber"
                      ? "text-amber-600"
                      : "text-primary-600"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight Card */}
      {topCategory && (
        <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border-primary-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Monthly Insight</h4>
              <p className="text-gray-600 mt-1">
                Your highest spending category this month is{" "}
                <span className="font-semibold">
                  {topCategory.categoryName}
                </span>{" "}
                at{" "}
                <span className="font-semibold">
                  {formatCurrency(topCategory.total, user?.currency)}
                </span>{" "}
                ({topCategory.percentage}% of total {activeType}).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Overview
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value, user?.currency)}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Category Breakdown
            </h3>
            <div className="flex gap-2">
              {["expense", "income"].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    activeType === type
                      ? type === "expense"
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {categoryBreakdown.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-gray-500">
              No {activeType} data for this month
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="total"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ categoryName, percentage }) =>
                      `${categoryName} (${percentage}%)`
                    }
                    labelLine={{ stroke: "#9ca3af" }}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell
                        key={entry.categoryId}
                        fill={
                          entry.color ||
                          CHART_COLORS[index % CHART_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value, user?.currency)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Category Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {activeType === "expense" ? "Expense" : "Income"} by Category
        </h3>
        {categoryBreakdown.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Transactions
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categoryBreakdown.map((cat) => (
                  <tr key={cat.categoryId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-gray-900">
                          {cat.categoryName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {formatCurrency(cat.total, user?.currency)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {cat.count}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              activeType === "expense"
                                ? "bg-red-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {cat.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

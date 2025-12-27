import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { transactionsAPI, reportsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  formatCurrency,
  formatDate,
  getCurrentMonth,
  getMonthOptions,
} from "../utils/helpers";
import { LoadingSpinner, PageHeader, EmptyState } from "../components/common";

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [summary, setSummary] = useState({ income: 0, expense: 0, net: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthOptions = getMonthOptions(12);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, transactionsRes, chartRes] = await Promise.all([
        reportsAPI.getSummary(selectedMonth),
        transactionsAPI.getAll({ month: selectedMonth, limit: 5 }),
        reportsAPI.getDailySpending(selectedMonth),
      ]);

      setSummary(summaryRes.data.data);
      setRecentTransactions(transactionsRes.data.data);
      setChartData(chartRes.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      title: "Total Income",
      value: formatCurrency(summary.income, user?.currency),
      icon: TrendingUp,
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(summary.expense, user?.currency),
      icon: TrendingDown,
      color: "red",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Net Savings",
      value: formatCurrency(summary.net, user?.currency),
      icon: Wallet,
      color: summary.net >= 0 ? "primary" : "amber",
      bgColor: summary.net >= 0 ? "bg-primary-50" : "bg-amber-50",
      iconColor: summary.net >= 0 ? "text-primary-600" : "text-amber-600",
    },
  ];

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
        title={`Welcome back, ${user?.fullName?.split(" ")[0]}!`}
        subtitle="Here's what's happening with your finances"
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
          <div key={card.title} className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(value) => formatCurrency(value, user?.currency)}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  fill="url(#incomeGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  fill="url(#expenseGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <Link
              to="/transactions"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="Start tracking by adding your first transaction"
              action={
                <Link to="/transactions/new" className="btn btn-primary">
                  Add Transaction
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === "income"
                          ? "bg-emerald-50"
                          : "bg-red-50"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.category?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount, user?.currency)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

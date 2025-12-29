import axios from "axios";

// Use environment variable for API URL, fallback to '/api' for local dev with proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for 401 errors on protected routes
    // Skip redirect for auth endpoints (login/register) to allow error handling
    const isAuthEndpoint =
      error.config?.url?.startsWith("/auth/login") ||
      error.config?.url?.startsWith("/auth/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/password", data),
};

// Categories API
export const categoriesAPI = {
  getAll: (type) => api.get("/categories", { params: { type } }),
  getOne: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Transactions API
export const transactionsAPI = {
  getAll: (params) => api.get("/transactions", { params }),
  getOne: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post("/transactions", data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Budgets API
export const budgetsAPI = {
  getAll: (month) => api.get("/budgets", { params: { month } }),
  create: (data) => api.post("/budgets", data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
};

// Reports API
export const reportsAPI = {
  getSummary: (month) => api.get("/reports/summary", { params: { month } }),
  getCategoryBreakdown: (month, type) =>
    api.get("/reports/category-breakdown", { params: { month, type } }),
  getDailySpending: (month) =>
    api.get("/reports/daily-spending", { params: { month } }),
};

export default api;

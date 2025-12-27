import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { path: "/categories", label: "Categories", icon: Tags },
    { path: "/budgets", label: "Budgets", icon: Target },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.path}
      onClick={() => mobile && setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-primary-50 text-primary-700 font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      <item.icon className="w-5 h-5" />
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FinTrack</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} mobile />
          ))}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex-1 lg:flex-none" />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                    <NavLink
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

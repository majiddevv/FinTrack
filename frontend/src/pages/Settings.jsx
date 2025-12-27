import { useState, useEffect } from "react";
import { User, Palette, Shield, Save, Loader2, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { PageHeader } from "../components/common";
import toast from "react-hot-toast";

const CURRENCIES = [
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
  { value: "PKR", label: "Pakistani Rupee (Rs.)", symbol: "Rs." },
  { value: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currency: "USD",
    settings: {
      showPaymentMethod: true,
      defaultView: "monthly",
    },
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || "",
        email: user.email || "",
        currency: user.currency || "USD",
        settings: {
          showPaymentMethod: user.settings?.showPaymentMethod ?? true,
          defaultView: user.settings?.defaultView || "monthly",
        },
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword)
      errors.currentPassword = "Current password is required";
    if (!passwordData.newPassword)
      errors.newPassword = "New password is required";
    else if (passwordData.newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters";
    if (passwordData.newPassword !== passwordData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await authAPI.changePassword(passwordData);
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Profile Information
              </h3>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="input bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div>
                  <label className="label">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="input"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Preferences
              </h3>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Show Payment Method
                    </p>
                    <p className="text-sm text-gray-500">
                      Display payment method field in transactions
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          showPaymentMethod:
                            !formData.settings.showPaymentMethod,
                        },
                      })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.settings.showPaymentMethod
                        ? "bg-primary-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData.settings.showPaymentMethod
                          ? "left-7"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <label className="label">Default View</label>
                  <select
                    value={formData.settings.defaultView}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          defaultView: e.target.value,
                        },
                      })
                    }
                    className="input"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Preferences
                </button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Change Password
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className={`input ${
                      passwordErrors.currentPassword ? "input-error" : ""
                    }`}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className={`input ${
                      passwordErrors.newPassword ? "input-error" : ""
                    }`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`input ${
                      passwordErrors.confirmPassword ? "input-error" : ""
                    }`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  Change Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

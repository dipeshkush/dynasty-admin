// src/pages/Settings.jsx

import { useState } from "react";
import {
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  Eye,
  Lock,
  CreditCard,
  Trash2,
  Bell,
  Mail,
  ShoppingCart,
  ShieldCheck,
} from "lucide-react";

export function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  // Form states (dummy values)
  const [businessName, setBusinessName] = useState("DairyDash");
  const [email, setEmail] = useState("admin@dairydash.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("123 Main Street, Indore");

  // Toggle states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      // Clear localStorage except auth keys
      const preserve = ["dynasty_premium_users", "dynasty_premium_current_user"];
      Object.keys(localStorage).forEach((key) => {
        if (!preserve.includes(key)) localStorage.removeItem(key);
      });
      alert("Data reset successfully! Reloading...");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your application preferences and account</p>
      </div>

      {/* Tabs - Pill style */}
      <div className="flex justify-center">
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1.5 shadow-inner">
          {["general", "notifications", "security", "billing", "data"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === tab
                  ? "bg-white text-indigo-700 shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-10">
            {/* Business Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                  />
                </div>

              </div>

              <div className="mt-8">
                <button className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Operating Hours</h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Monday - Friday</p>
                    <p className="text-sm text-gray-600">6:00 AM - 10:00 PM</p>
                  </div>
                  <button className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                    Edit
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Saturday - Sunday</p>
                    <p className="text-sm text-gray-600">7:00 AM - 9:00 PM</p>
                  </div>
                  <button className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
            <div className="space-y-6 divide-y divide-gray-200">
              {[
                {
                  label: "Email Notifications",
                  desc: "Receive email about your account activity",
                  checked: emailNotifications,
                  setter: setEmailNotifications,
                },
                {
                  label: "Order Notifications",
                  desc: "Get notified when new orders arrive",
                  checked: orderNotifications,
                  setter: setOrderNotifications,
                },
                {
                  label: "Low Stock Alerts",
                  desc: "Alert when products are running low",
                  checked: lowStockAlerts,
                  setter: setLowStockAlerts,
                },
                {
                  label: "System Updates",
                  desc: "Get notified about system updates",
                  checked: systemUpdates,
                  setter: setSystemUpdates,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-focus:ring-4 peer-focus:ring-indigo-200 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-10">
            {/* Change Password */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all"
                  />
                </div>

                <button className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                  Update Password
                </button>
              </div>
            </div>

            {/* 2FA */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Two-Factor Authentication</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Enable 2FA</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-focus:ring-4 peer-focus:ring-indigo-200 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-8">
            {/* Subscription Plan */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Plan</h2>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Pro Plan</h3>
                  <p className="text-sm text-gray-600">$49/month • Unlimited orders</p>
                </div>
                <button className="px-5 py-2.5 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  Manage Plan
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Visa ending in 4242</p>
                  <p className="text-sm text-gray-600">Expires 12/2026</p>
                </div>
                <button className="px-5 py-2.5 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Management Tab */}
        {activeTab === "data" && (
          <div className="space-y-8">
            {/* Data Persistence Info */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-5">
              <div className="p-3 rounded-full bg-red-50 flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Persistence</h2>
                <p className="text-gray-600 mb-4">
                  All changes made in the admin panel are automatically saved to your browser's local storage 
                  and will persist across page refreshes, navigation, and logout/login sessions.
                </p>
                <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-2">
                  <p className="text-sm font-medium text-gray-900">Persistent Data Includes:</p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                    <li>Products, Orders, Customers</li>
                    <li>Branches, Delivery Staff</li>
                    <li>Push Notifications</li>
                    <li>Homepage Settings</li>
                    <li>All CRUD operations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reset Data */}
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-5">
              <div className="p-3 rounded-full bg-red-100 flex-shrink-0">
                <RotateCcw className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-red-700 mb-3">Reset All Data</h2>
                <p className="text-gray-700 mb-4">
                  This will reset all data to default values. Your user account will be preserved, 
                  but all products, orders, customers, branches, and other data will be restored to 
                  their original state.
                </p>
                <button
                  onClick={handleResetData}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  <RotateCcw size={16} />
                  Reset All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
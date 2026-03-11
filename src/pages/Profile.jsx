// src/pages/Profile.jsx (or ProfileSettings.jsx)

import { useState, useEffect } from "react";
import { Mail, Phone, Shield, Save, Calendar, Clock, CheckCircle } from "lucide-react";

export function Profile() {
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Admin",
    permissions: [],
  });

  // Helper to load user from localStorage
  const getInitialData = () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;

      const user = JSON.parse(stored);

      let first = user.firstName || "";
      let last = user.lastName || "";

      if (!first && user.name) {
        const parts = user.name.split(" ");
        first = parts[0];
        last = parts.slice(1).join(" ");
      }

      return {
        firstName: first || "",
        lastName: last || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "Admin",
        permissions: user.permissions || [],
        id: user.id || user._id,
        // Dummy extra info (you can replace with real data later)
        joinDate: user.createdAt || "Jan 15, 2025",
        lastLogin: user.lastLogin || "Today, 2:34 PM",
        status: "Active",
      };
    } catch (e) {
      console.error("Error parsing user data", e);
      return null;
    }
  };

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      const data = getInitialData();

      if (data) {
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: data.role,
          permissions: data.permissions,
          joinDate: data.joinDate,
          lastLogin: data.lastLogin,
          status: data.status,
        });
      }

      setTimeout(() => setLoading(false), 800); // simulated delay
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      const updated = {
        ...stored,
        ...payload,
        name: `${payload.firstName} ${payload.lastName}`.trim(),
      };

      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        <p className="mt-6 text-gray-600 font-medium">Loading your profile...</p>
      </div>
    );
  }

  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(" ") || "User";
  const initials = (formData.firstName[0] || "") + (formData.lastName[0] || "");
  const avatarColor = "from-indigo-500 to-purple-600";

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Profile Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  mx-auto">
        {/* Left - Profile Card (Enhanced) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sticky top-6">
            <div className="flex flex-col items-center text-center pb-8 border-b border-gray-100">
              <div
                className={`h-32 w-32 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-5xl font-bold mb-6 shadow-xl ring-8 ring-indigo-100/50`}
              >
                {initials.toUpperCase() || "U"}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h2>
              <p className="text-sm text-gray-500 mb-4">{formData.email || "No email set"}</p>

              <div className="flex items-center gap-2 ">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="px-4 py-1.5 text-sm font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                  {formData.role || "Admin"}
                </span>
              </div>
            </div>

            {/* Extra Info */}
            <div className="mt-2 space-y-6">
              <div className="flex items-center gap-4 text-sm">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Joined On</p>
                  <p className="font-medium text-gray-900">{formData.joinDate || "Jan 15, 2025"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Login</p>
                  <p className="font-medium text-gray-900">{formData.lastLogin || "Today, 2:34 PM"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Status</p>
                  <p className="font-medium text-emerald-700">Active</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Permissions</p>
                  <p className="font-medium text-gray-900">{formData.permissions.length || 0} granted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Edit Profile</h2>

            <form onSubmit={handleSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. John"
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all bg-white shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Doe"
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all bg-white shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    value={formData.email}
                    disabled
                    className="w-full px-5 py-3.5 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-500 cursor-not-allowed shadow-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Email cannot be changed directly.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/30 transition-all bg-white shadow-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
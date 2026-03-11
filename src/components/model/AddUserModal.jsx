// src/components/modal/AddUserModal.jsx

import { useState } from "react";
import { Check, X } from "lucide-react";

// Permissions list (from your controller)
const PANEL_PERMISSIONS = [
  "dashboard", "inventory", "orders", "delivery", "customers", "reports", 
  "products", "settings", "userManagement", "profile", "membership", 
  "analytics", "auditLogs", "billing", "content", "wallet", 
  "helpSupport", "apiAccess"
];

export function AddUserModal({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    permissions: ["dashboard", "orders"], // Default as per your controller
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (permission) => {
    setFormData((prev) => {
      const current = prev.permissions;
      if (current.includes(permission)) {
        return { ...prev, permissions: current.filter((p) => p !== permission) };
      } else {
        return { ...prev, permissions: [...current, permission] };
      }
    });
  };

  const toggleAllPermissions = () => {
    if (formData.permissions.length === PANEL_PERMISSIONS.length) {
      setFormData((prev) => ({ ...prev, permissions: [] }));
    } else {
      setFormData((prev) => ({ ...prev, permissions: [...PANEL_PERMISSIONS] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.email || !formData.phone || !formData.password) {
      alert("Please fill in all required fields");
      return;
    }

    // Pass data to parent
    onSave(formData);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      permissions: ["dashboard", "orders"],
    });

    // Close modal
    onOpenChange(false);

    // Success message
    alert("User added successfully!");
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={() => onOpenChange(false)}
      >
        {/* Modal Content */}
        <div
          className="w-full max-w-[650px] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b bg-gray-50 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Add New Panel User</h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new staff account with specific permissions.
            </p>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="e.g. John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="e.g. Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                  />
                </div>
              </div>

              <div className="h-px bg-gray-200 my-6" />

              {/* Permissions */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-medium">
                      2
                    </span>
                    Access Permissions
                  </h3>

                  <button
                    type="button"
                    onClick={toggleAllPermissions}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                  >
                    {formData.permissions.length === PANEL_PERMISSIONS.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PANEL_PERMISSIONS.map((perm) => {
                    const isSelected = formData.permissions.includes(perm);
                    const label = perm
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());

                    return (
                      <div
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none
                          ${isSelected
                            ? "bg-blue-50 border-blue-200 shadow-sm"
                            : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"}`}
                      >
                        <div
                          className={`h-5 w-5 rounded border flex items-center justify-center transition-colors
                            ${isSelected ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-300"}`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            isSelected ? "text-blue-700" : "text-gray-600"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-5 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="add-user-form"
              className="px-6 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            >
              Create User
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
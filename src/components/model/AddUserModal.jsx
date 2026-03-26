import { useState, useEffect } from "react";
import { Check, UserPlus, X } from "lucide-react";
import { useCreateAdminMutation, useUpdateAdminMutation } from "../../services/authApi"; 

const PANEL_PERMISSIONS = [
  "dashboard", "inventory", "orders", "delivery", "customers", "reports",
  "products", "settings", "userManagement", "profile", "membership",
  "analytics", "auditLogs", "billing", "content", "wallet",
  "helpSupport", "apiAccess"
];

export function AddUserModal({ open, onOpenChange, editData = null }) {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "", 
    permissions: ["dashboard", "orders"],
  });

  const [errorMsg, setErrorMsg] = useState("");

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation(); 
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        setFormData({
          firstName: editData.firstName || "",
          lastName: editData.lastName || "",
          email: editData.email || "",
          phone: editData.phoneNumber || editData.phone || "",
          password: "", 
          permissions: editData.modules || editData.permissions || [],
        });
      } else {
        // Add mode default
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          permissions: ["dashboard", "orders"],
        });
      }
      setErrorMsg("");
    }
  }, [open, editData, isEditMode]);

  // Escape key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onOpenChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (permission) => {
    setFormData((prev) => {
      const current = prev.permissions;
      if (current.includes(permission)) {
        return { ...prev, permissions: current.filter((p) => p !== permission) };
      }
      return { ...prev, permissions: [...current, permission] };
    });
  };

  const toggleAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions:
        prev.permissions.length === PANEL_PERMISSIONS.length
          ? []
          : [...PANEL_PERMISSIONS],
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");

  if (!formData.firstName || !formData.email || !formData.phone) {
    setErrorMsg("Please fill in all required fields");
    return;
  }

  if (!isEditMode && !formData.password) {
    setErrorMsg("Password is required when creating a new user");
    return;
  }

  try {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phone,
      modules: formData.permissions,
    };

    // console.log("=====================================");
    // console.log("MODE:", isEditMode ? "UPDATE" : "CREATE");
    // console.log("EDIT DATA ID:", editData?.id);                    
    // console.log("Payload before send:", JSON.stringify(payload, null, 2));

    let result;

    if (isEditMode) {
      if (formData.password?.trim()) {
        payload.password = formData.password;
      }

      console.log("FINAL UPDATE PAYLOAD:", JSON.stringify(payload, null, 2));

      result = await updateAdmin({ id: editData.id, ...payload }).unwrap();

      console.log("UPDATE SUCCESS RESPONSE:", result);
      alert("User updated successfully!");
    } else {
      payload.password = formData.password;
      result = await createAdmin(payload).unwrap();
      console.log("CREATE SUCCESS RESPONSE:", result);
      alert("User created successfully!");
    }

    console.log("Operation completed successfully");
    onOpenChange(false);
  } catch (error) {
    console.error("UPDATE/CREATE FAILED WITH ERROR:");
    console.error("Error object:", error);
    console.error("Status:", error?.status);
    console.error("Data:", error?.data);
    console.error("Message:", error?.data?.message);

    setErrorMsg(error?.data?.message || `Failed to ${isEditMode ? "update" : "create"} user`);
  }
};
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-[680px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b bg-gray-50/80 flex items-center gap-3">
          <UserPlus className="h-6 w-6 text-indigo-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? "Edit Panel User" : "Add New Panel User"}
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {isEditMode
                ? "Update staff account details and permissions."
                : "Create a new staff account with specific access."}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-8">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <X className="h-4 w-4" />
                {errorMsg}
              </div>
            )}

            {/* Personal Details */}
            <section className="space-y-5">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Personal Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    required
                    value={formData.firstName}
                    placeholder="First Name"
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 text-sm"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="test@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 text-sm"
                    disabled={isEditMode} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  {isEditMode ? "New Password (optional)" : "Password"} <span className="text-red-500">*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  required={!isEditMode}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditMode ? "Leave blank to keep current" : "••••••••"}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 text-sm"
                />
              </div>
            </section>

            <hr className="my-6 border-gray-200" />

            {/* Permissions Section - same as before */}
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Permissions
                </h3>
                <button
                  type="button"
                  onClick={toggleAllPermissions}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {formData.permissions.length === PANEL_PERMISSIONS.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {PANEL_PERMISSIONS.map((perm) => {
                  const isSelected = formData.permissions.includes(perm);
                  const label = perm.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

                  return (
                    <button
                      key={perm}
                      type="button"
                      onClick={() => togglePermission(perm)}
                      className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all ${isSelected ? "bg-indigo-50 border-indigo-300" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"}`}>
                        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? "text-indigo-800" : "text-gray-700"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? "Update User" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
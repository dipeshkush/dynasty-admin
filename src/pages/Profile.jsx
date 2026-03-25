import { useState, useEffect } from "react";
import { Save, Calendar, Clock, CheckCircle, Shield } from "lucide-react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation
} from "../services/authApi";

export function Profile() {

  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    if (data?.success) {
      const profile = data.profile;

      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phoneNumber || "",
      });
    }
  }, [data]);

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    if (password.length < 8) {
      setPasswordStrength("Weak");
    } else if (password.length < 12) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone,
      }).unwrap();

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Profile update failed");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      }).unwrap();
      alert("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength("");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Password change failed");
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        <p className="mt-6 text-gray-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  const fullName =
    `${formData.firstName} ${formData.lastName}`.trim() || "User";

  const initials =
    (formData.firstName?.[0] || "") + (formData.lastName?.[0] || "");

  return (
    <div className="p-6 lg:p-10 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        Profile Settings
      </h1>
      <p className="text-gray-600 mb-8">
        Manage your profile information and preferences
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <Save size={16} />
                  {updating ? "Saving..." : "Save Changes"}
                </button>

              </div>
            </form>
          </div>
          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-3 text-sm text-gray-600"
                  >
                    {showOldPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <p>Password must be at least 8 characters long and include a mix of letters and numbers.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-sm text-gray-600"
                    >
                      {showNewPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                  {passwordStrength && (
                    <p className="text-xs mt-1">
                      Strength: {passwordStrength}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-sm text-gray-600"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 fixed right-10 w-[400px]">
          <div className="flex flex-col items-center text-center pb-8 border-b">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
              {initials.toUpperCase() || "U"}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-500">{formData.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                SuperAdmin
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span>Joined: Jan 2025</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Last Login: Today</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>Status: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
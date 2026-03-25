import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  Shield,
  UserCheck,
  RefreshCw,
  Download,
  ChevronDown,
  X,
} from "lucide-react";
import { AddUserModal } from "../components/model/AddUserModal";
import { useGetAdminsQuery, useDeleteAdminMutation } from "../services/authApi";

export function UserManagement() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data, isLoading, refetch } = useGetAdminsQuery();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const users = useMemo(() => {
    if (!data?.admins) return [];

    return data.admins.map((admin) => ({
      id: admin._id,
      name: `${admin.firstName} ${admin.lastName || ""}`.trim(),
      email: admin.email,
      role: admin.role || "PanelUser",
      phone: admin.phoneNumber || "-",
      modules: admin.modules || [],
      firstName: admin.firstName || "",
      lastName: admin.lastName || "",
      phoneNumber: admin.phoneNumber || "",
    }));
  }, [data]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        selectedRole === "All Roles" || user.role === selectedRole;

      const matchesModule =
        selectedModule === "All Modules" ||
        (user.modules || []).some((m) =>
          m.toLowerCase().includes(selectedModule.toLowerCase())
        );

      return matchesSearch && matchesRole && matchesModule;
    });
  }, [search, selectedRole, selectedModule, users]);

  const handleAddUser = () => {
    setSelectedUserForEdit(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUserForEdit(user);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteAdmin(userToDelete.id).unwrap();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      // List auto-refreshes via invalidatesTags in RTK Query
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.data?.message || "Failed to delete admin. Please try again.");
    }
  };

  const handleModalChange = (open) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedUserForEdit(null);
      refetch(); // fallback refresh
    }
  };

  const handleRefresh = () => refetch();

  const handleExport = () => {
    if (filteredUsers.length === 0) {
      alert("No users to export");
      return;
    }

    const headers = ["Name", "Email", "Role", "Phone"];
    const csvRows = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [user.name, user.email, user.role, user.phone]
          .map((val) => `"${val?.toString().replace(/"/g, '""') || ""}"`)
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users_export_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage system users and roles</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={14} />
            Export
          </button>

          <button
            onClick={handleAddUser}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={14} />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Users size={18} className="text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {users.filter((u) => u.role === "Admin").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Shield size={18} className="text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">18</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <UserCheck size={18} className="text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-indigo-400 transition-all"
          />
        </div>

        <div className="relative min-w-[160px]">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:border-indigo-400 appearance-none pr-8"
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>PanelUser</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative min-w-[180px]">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:border-indigo-400 appearance-none pr-8"
          >
            <option>All Modules</option>
            <option>Dashboard</option>
            <option>Products</option>
            <option>Orders</option>
            <option>Customers</option>
            <option>Wallet</option>
            <option>Reports</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Name</th>
              <th className="px-6 py-3 text-left font-medium">Email</th>
              <th className="px-6 py-3 text-left font-medium">Role</th>
              <th className="px-6 py-3 text-left font-medium">Phone</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-3 text-gray-600">{user.email}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{user.phone}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit2 size={14} className="text-indigo-600" />
                      </button>

                      <button
                        onClick={() => openDeleteModal(user)}
                        disabled={isDeleting}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50"
                        }`}
                        title="Delete user"
                      >
                        {isDeleting ? (
                          <RefreshCw size={14} className="animate-spin text-red-500" />
                        ) : (
                          <Trash2 size={14} className="text-red-500" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <AddUserModal
        open={isModalOpen}
        onOpenChange={handleModalChange}
        editData={selectedUserForEdit}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b bg-red-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Delete Confirmation</h3>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to permanently delete this admin?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <p className="font-medium text-gray-900">{userToDelete.name}</p>
                <p className="text-sm text-gray-600">{userToDelete.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Role: {userToDelete.role}
                </p>
              </div>
              <p className="text-sm text-red-600 font-medium">
                This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm disabled:opacity-60 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
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
} from "lucide-react";
import { AddUserModal } from "../components/model/AddUserModal";

export function UserManagement() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Dummy users data
  const [users, setUsers] = useState([
    { id: 1, name: "Akash Yadav", email: "akash@gmail.com", role: "PanelUser", phone: "9123456780" },
    { id: 2, name: "Akhilesh Yadav", email: "akhileshyadav12@gmail.com", role: "PanelUser", phone: "7081333616" },
    { id: 3, name: "Amit Kumar", email: "amitkumart12@gmail.com", role: "PanelUser", phone: "8782282833" },
    { id: 4, name: "Amit Verma", email: "amitverma@gmail.com", role: "PanelUser", phone: "9123456789" },
    { id: 5, name: "Amit Yadav", email: "ujjawalkeshri2017@gmail.com", role: "PanelUser", phone: "09532775226" },
    { id: 6, name: "Mohan Singh", email: "mohan.stock@dynasty.com", role: "PanelUser", phone: "9876543202" },
    { id: 7, name: "Rajesh Kumar", email: "rajesh@dynasty.com", role: "Admin", phone: "9876543210" },
  ]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        selectedRole === "All Roles" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [search, selectedRole, users]);

  // Refresh button - simulates reload
  const handleRefresh = () => {
    // In real app: fetch from API again
    alert("Refreshing user list... (dummy)");
    // Optional: reset filters or re-fetch dummy data
    setSearch("");
    setSelectedRole("All Roles");
  };

  // Export button - downloads CSV
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
          .map((val) => `"${val}"`)
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("Users exported as CSV!");
  };

  // Add user - open modal
  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  // Save new user from modal
  const handleSaveUser = (newUser) => {
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    setUsers([...users, { id: newId, ...newUser }]);
    alert("New user added! (dummy save)");
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
                {users.filter(u => u.role === "Admin").length}
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
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Role Dropdown */}
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

        {/* Module Dropdown */}
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-2 text-gray-600">{user.email}</td>
                  <td className="px-6 py-2">
                    <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-gray-600">{user.phone}</td>
                  <td className="px-6 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 size={14} className="text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSaveUser}
      />
    </div>
  );
}
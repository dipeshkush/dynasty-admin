// src/pages/PushNotifications.jsx

import { useState } from "react";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Clock,
  CheckCircle,
  BarChart3,
  RefreshCw,
  Users2,
  Download,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import { CreateNotificationModal } from "../components/model/CreateNotificationModal";

// Dummy data
const dummyStats = {
  totalSent: 1245,
  scheduled: 87,
  drafts: 32,
  avgClickRate: "18.7%",
};

const dummyNotifications = [
  {
    id: "notif-001",
    title: "Flash Sale: 50% OFF on Groceries",
    description: "Limited time offer on all fresh items!",
    audience: "All Users",
    type: "Promo",
    status: "sent",
    delivered: 1245,
    clickRate: "22.4%",
    date: "10 Mar 2026",
    time: "11:30 AM",
  },
  {
    id: "notif-002",
    title: "Order Confirmation Reminder",
    description: "Your order #ORD123 is ready to ship!",
    audience: "Specific Customers",
    type: "Order",
    status: "scheduled",
    delivered: 0,
    clickRate: "0.0%",
    date: "11 Mar 2026",
    time: "09:00 AM",
  },
  {
    id: "notif-003",
    title: "System Maintenance Alert",
    description: "App will be down for 30 mins tonight.",
    audience: "All Users",
    type: "System",
    status: "draft",
    delivered: 0,
    clickRate: "0.0%",
    date: "N/A",
    time: "",
  },
];

export function PushNotifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Client-side filter (for demo)
  const filteredNotifications = dummyNotifications.filter((n) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(query) || n.description.toLowerCase().includes(query);
    const matchesAudience = audienceFilter === "all" || n.audience === audienceFilter;
    const matchesType = typeFilter === "all" || n.type === typeFilter;
    const matchesStatus = statusFilter === "all" || n.status === statusFilter;
    return matchesSearch && matchesAudience && matchesType && matchesStatus;
  });

  const handleRefresh = () => {
    alert("Notifications refreshed (dummy)");
  };

  const handleExport = () => {
    alert("Exporting notifications... (dummy)");
  };

  const handleView = (id) => {
    alert(`Viewing notification: ${id} (dummy)`);
  };

  const handleEdit = (id) => {
    const notification = dummyNotifications.find((n) => n.id === id);
    if (notification) {
      setSelectedNotification(notification);
      setEditModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    const notification = dummyNotifications.find((n) => n.id === id);
    if (notification) {
      setSelectedNotification(notification);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    alert(`Deleted "${selectedNotification?.title}" (dummy)`);
    setDeleteModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Push Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">Manage app notifications and campaigns</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={14} />
            Export
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={14} />
            Create Notification
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Sent", value: dummyStats.totalSent, icon: Mail, color: "indigo" },
          { label: "Scheduled", value: dummyStats.scheduled, icon: Clock, color: "green" },
          { label: "Drafts", value: dummyStats.drafts, icon: Edit2, color: "yellow" },
          { label: "Avg Click Rate", value: dummyStats.avgClickRate, icon: BarChart3, color: "pink" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-${stat.color}-600 bg-${stat.color}-100`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border bg-gray-50 border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
            />
          </div>

          {[
            { label: "Audience", value: audienceFilter, setter: setAudienceFilter, options: ["all", "All Users", "Downtown Branch", "Specific Customers"] },
            { label: "Type", value: typeFilter, setter: setTypeFilter, options: ["all", "Promo", "System", "Order"] },
            { label: "Status", value: statusFilter, setter: setStatusFilter, options: ["all", "sent", "scheduled", "draft"] },
            { label: "Time", value: timeFilter, setter: setTimeFilter, options: ["all", "today", "week", "month"] },
          ].map(({ label, value, setter, options }) => (
            <div key={label} className="relative min-w-[160px]">
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-gray-50 focus:outline-none focus:border-indigo-400 appearance-none pr-10"
              >
                <option value="all">All {label}</option>
                {options.filter(o => o !== "all").map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left font-medium w-12">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-6 py-4 text-left font-medium">TITLE</th>
              <th className="px-6 py-4 text-left font-medium">AUDIENCE</th>
              <th className="px-6 py-4 text-left font-medium">TYPE</th>
              <th className="px-6 py-4 text-left font-medium">STATUS</th>
              <th className="px-6 py-4 text-left font-medium">ANALYTICS</th>
              <th className="px-6 py-4 text-left font-medium">DATE</th>
              <th className="px-6 py-4 text-right font-medium">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredNotifications.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-5">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>

                <td className="px-6 py-5">
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      {n.status === "sent" && <span className="h-2 w-2 bg-green-500 rounded-full" />}
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">{n.description}</p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="text-xs text-gray-600 flex items-center gap-2">
                    <Users2 size={14} className="text-gray-400" />
                    {n.audience}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                      n.type === "Promo"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                        : n.type === "System"
                        ? "bg-gray-50 text-gray-700 border-gray-100"
                        : "bg-purple-50 text-purple-700 border-purple-100"
                    }`}
                  >
                    {n.type}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
                      n.status === "sent"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : n.status === "scheduled"
                        ? "bg-orange-50 text-orange-700 border-orange-100"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {n.status === "sent" && <CheckCircle size={12} />}
                    {n.status === "scheduled" && <Clock size={12} />}
                    {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                  </span>
                </td>

                <td className="px-6 py-5 text-xs text-gray-500">
                  <div>Delivered: <span className="font-medium text-gray-900">{n.delivered.toLocaleString()}</span></div>
                  <div>Click Rate: <span className="font-medium text-gray-900">{n.clickRate}</span></div>
                </td>

                <td className="px-6 py-5 text-gray-600">
                  {n.date !== "N/A" ? (
                    <>
                      <div>{n.date}</div>
                      <div className="text-xs text-gray-400">{n.time}</div>
                    </>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleView(n.id)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleEdit(n.id)}
                      className="p-1.5 hover:bg-indigo-50 rounded text-gray-600 hover:text-indigo-700"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-1.5 hover:bg-red-50 rounded text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredNotifications.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-500 text-sm">
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {filteredNotifications.length} of {dummyNotifications.length} results
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <CreateNotificationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSend={(data) => {
          alert("Notification created! (dummy)\n" + JSON.stringify(data, null, 2));
        }}
      />

      {/* Edit Modal Placeholder */}
      {editModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Notification</h2>
              <button onClick={() => setEditModalOpen(false)}>
                <X size={24} className="text-gray-600 hover:text-gray-900" />
              </button>
            </div>
            <p className="text-center text-gray-600 py-8">Edit form would appear here (placeholder)</p>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-6 py-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button className="px-6 py-3 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                Update Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Notification</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedNotification.title}"?  
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-6 py-3 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-3 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
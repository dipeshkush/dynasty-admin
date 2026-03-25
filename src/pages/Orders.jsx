// src/pages/Orders.jsx

import { useState } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Trash2,
  MapPin,
  Package,
  CheckCircle,
  Clock,
  RefreshCw,
  Loader2,
  Download
} from "lucide-react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation, useLazyExportOrdersQuery } from "../services/ordersApi";

export function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = data?.orders || [];

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(query) ||
      order.customer?.firstName?.toLowerCase().includes(query) ||
      order.customer?.phone?.includes(query) ||
      order._id?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (order.orderStatus)?.toLowerCase() === statusFilter.toLowerCase();

    const matchesPayment =
      paymentFilter === "all" ||
      (order.paymentMethod || "COD").toLowerCase() === paymentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "preparing":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "outfordelivery":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentBadge = (method, status) => {
    if (method === "Razorpay" || status === "Paid") {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (method === "Wallet" || status === "Paid") {
      return "bg-teal-100 text-teal-700 border-teal-200";
    }
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  // Handle status change with confirmation
  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to "${newStatus}"?`)) {
      return;
    }

    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      alert(`Order status updated to "${newStatus}" successfully`);
      refetch(); // Refresh the list
    } catch (err) {
      alert("Failed to update status: " + (err?.data?.message || err?.message || "Unknown error"));
    }
  };
  const [triggerExport, { isFetching: isExporting }] = useLazyExportOrdersQuery();

  const handleExport = async () => {
    try {
      const startDate = "2026-01-01";
      const endDate = new Date().toISOString().split("T")[0];

      const blob = await triggerExport({ startDate, endDate }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orders-report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (err) {
      alert("Export failed");
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">All Orders</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage all customer orders</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw size={14} />}
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download size={14} />
            )}
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search - half space */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Order ID, Customer, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border bg-gray-50 border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Right half - Status + Payment filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-gray-50 focus:outline-none focus:border-indigo-400 appearance-none pr-10"
              >
                <option value="all">All Status</option>
                <option value="Placed">Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="OutForDelivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Pending">Pending</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Payment Filter */}
            <div className="relative">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-gray-50 focus:outline-none focus:border-indigo-400 appearance-none pr-10"
              >
                <option value="all">All Payment</option>
                <option value="COD">COD</option>
                <option value="Wallet">Wallet</option>
                <option value="Razorpay">Razorpay</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results count & entries selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-600">
        <div>
          Showing {Math.min(filteredOrders.length, entriesPerPage)} of {filteredOrders.length} results
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Show:</label>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left font-medium">ORDER ID</th>
              <th className="px-6 py-3 text-left font-medium">CUSTOMER</th>
              <th className="px-6 py-3 text-left font-medium">LOCATION</th>
              <th className="px-6 py-3 text-left font-medium">ITEMS</th>
              <th className="px-6 py-3 text-left font-medium">TOTAL</th>
              <th className="px-6 py-3 text-left font-medium">PAYMENT</th>
              <th className="px-6 py-3 text-left font-medium">DATE</th>
              <th className="px-6 py-3 text-left font-medium">STATUS</th>
              <th className="px-6 py-3 text-right font-medium">CHANGE STATUS</th>
              <th className="px-6 py-3 text-right font-medium">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="h-64 text-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-600" />
                  <p className="mt-4 text-gray-500">Loading orders...</p>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-red-600">
                  Failed to load orders. Please try again.
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.slice(0, entriesPerPage).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-indigo-600">
                    #{order.orderNumber || order._id?.slice(-8)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {order.customer?.firstName?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium">{order.customer?.firstName || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{order.customer?.phone || "—"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600 max-w-[180px] truncate" title={order.address?.flat + ", " + order.address?.area}>
                    {order.address?.flat + ", " + order.address?.area + ", " + order.address?.city || "—"}
                  </td>

                  <td className="px-6 py-4 text-center">{order.items?.length || 1}</td>

                  <td className="px-6 py-4 font-semibold text-indigo-700">
                    ₹{(order.finalAmount || order.totalAmount || 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-600">{order.paymentMethod || "COD"}</span>
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border ${getPaymentBadge(order.paymentMethod, order.paymentStatus)}`}>
                        {order.paymentStatus || "Pending"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                      : "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus || "Placed"}
                    </span>
                  </td>

                  {/* Status Change Dropdown */}
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block min-w-[140px]">
                      <select
                        value={order.orderStatus || "Placed"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={isUpdating}
                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 bg-white appearance-none pr-8 cursor-pointer disabled:opacity-50"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="OutForDelivery">Out For Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                      {isUpdating && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-indigo-600" />}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* <button className="p-2 hover:bg-indigo-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={16} className="text-indigo-600" />
                      </button> */}
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete Order">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
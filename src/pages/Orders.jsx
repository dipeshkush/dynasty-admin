// src/pages/Orders.jsx

import { useState } from 'react';
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
  Download,
} from 'lucide-react';


// Dummy orders (tumhare screenshot ke hisaab se)
const dummyOrders = [
  {
    orderId: 'ORD001026',
    customer: 'A',
    initials: 'P',
    location: 'Juni Indore Tahsil, Mumbai',
    items: 1,
    total: 59,
    payment: 'COD',
    paymentStatus: 'Pending',
    date: '6/3/2026',
    status: 'Placed',
  },
  {
    orderId: 'ORD001025',
    customer: 'Unknown',
    initials: 'U',
    location: 'Rajkumar Bridge, Mumbai',
    items: 1,
    total: 30,
    payment: 'COD',
    paymentStatus: 'Pending',
    date: '6/3/2026',
    status: 'Placed',
  },
  {
    orderId: 'ORD001024',
    customer: 'B',
    initials: 'P',
    location: 'Juni Indore Tahsil, Mumbai',
    items: 1,
    total: 59,
    payment: 'COD',
    paymentStatus: 'Pending',
    date: '6/3/2026',
    status: 'Cancelled',
  },
  {
    orderId: 'ORD001023',
    customer: 'C',
    initials: 'P',
    location: 'Juni Indore Tahsil, Mumbai',
    items: 1,
    total: 85,
    payment: 'COD',
    paymentStatus: 'Pending',
    date: '6/3/2026',
    status: 'Cancelled',
  },
  {
    orderId: 'ORD001022',
    customer: 'D',
    initials: 'P',
    location: 'Juni Indore Tahsil, Mumbai',
    items: 1,
    total: 85,
    payment: 'COD',
    paymentStatus: 'Pending',
    date: '6/3/2026',
    status: 'Cancelled',
  },
  {
    orderId: 'ORD001021',
    customer: 'Unknown',
    initials: 'U',
    location: 'Juni Indore Tahsil, Mumbai',
    items: 1,
    total: 59,
    payment: 'COD',
    paymentStatus: 'Pending',
    date: '5/3/2026',
    status: 'Placed',
  },
  {
    orderId: 'ORD001020',
    customer: 'Unknown',
    initials: 'U',
    location: 'Indore Mumbai',
    items: 1,
    total: 30,
    payment: 'COD',
    paymentStatus: 'Pending',
    date: '5/3/2026',
    status: 'Placed',
  },

];

const stats = {
  total: 124,
  today: 18,
  pending: 7,
  delivered: 89,
};

export function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const filteredOrders = dummyOrders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderId.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Status badge colors
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'placed':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Payment badge colors
  const getPaymentBadge = (status) => {
    return status === 'Pending'
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : 'bg-indigo-100 text-indigo-700 border-indigo-200';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track all your orders
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <RefreshCw size={14} />
            Refresh
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.today}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-indigo-600">
              <Clock size={24} className='text-green-700' />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-indigo-600">
              <Clock size={24} className='text-yellow-700' />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.delivered}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-indigo-600">
              <CheckCircle size={24} className='text-pink-700' />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order ID, Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative min-w-[180px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-white focus:outline-none focus:border-indigo-400 appearance-none pr-10"
          >
            <option value="all">All Status</option>
            <option value="Placed">Placed</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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

      {/* Table - bilkul same UI jo tune diya tha */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Order ID</th>
              <th className="px-6 py-3 text-left font-medium">Customer</th>
              <th className="px-6 py-3 text-left font-medium">Location</th>
              <th className="px-6 py-3 text-left font-medium">Items</th>
              <th className="px-6 py-3 text-left font-medium">Total</th>
              <th className="px-6 py-3 text-left font-medium">Payment</th>
              <th className="px-6 py-3 text-left font-medium">Date</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.slice(0, entriesPerPage).map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2 font-medium text-indigo-600">{order.orderId}</td>

                  <td className="px-6 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                        {order.initials}
                      </div>
                      <span className="font-medium">{order.customer}</span>
                    </div>
                  </td>

                  <td className="px-6 py-2 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-500 flex-shrink-0" />
                      <span className="truncate max-w-[180px]" title={order.location}>
                        {order.location}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-2">{order.items} items</td>

                  <td className="px-6 py-2 font-medium">₹{order.total}</td>

                  <td className="px-6 py-2 ">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-600">{order.payment}</span>
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md border ${getPaymentBadge(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-2 text-gray-600">{order.date}</td>

                  <td className="px-6 py-2">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Eye size={14} className="text-indigo-600" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  );
}

// Helper functions (same as before)
function getStatusBadge(status) {
  switch (status.toLowerCase()) {
    case 'placed':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'delivered':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getPaymentBadge(status) {
  return status === 'Pending'
    ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-indigo-100 text-indigo-700 border-indigo-200';
}
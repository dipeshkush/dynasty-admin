// src/pages/Dashboard.jsx

import { useState, useMemo } from 'react';
import { 
  ShoppingCart, DollarSign, Users, TrendingUp, 
  Download, Calendar, ChevronDown 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Dummy data (hardcoded - same as reference)
const revenueData = [
  { month: 'Jan', income: 12000, expenses: 6000 },
  { month: 'Feb', income: 15000, expenses: 7500 },
  { month: 'Mar', income: 18000, expenses: 9000 },
  { month: 'Apr', income: 14000, expenses: 7000 },
  { month: 'May', income: 22000, expenses: 11000 },
  { month: 'Jun', income: 17000, expenses: 8500 },
  { month: 'Jul', income: 25000, expenses: 12500 },
];

const orderSummaryData = [
  { date: 'Today', completed: 18, pending: 5 },
  { date: 'Yesterday', completed: 12, pending: 4 },
  { date: 'Mon', completed: 15, pending: 2 },
  { date: 'Sun', completed: 8, pending: 1 },
  { date: 'Sat', completed: 20, pending: 5 },
];

const topProducts = [
  { name: "Product A", price: 499, stock: 45 },
  { name: "Product B", price: 799, stock: 32 },
  { name: "Product C", price: 299, stock: 120 },
  { name: "Product D", price: 1299, stock: 18 },
  { name: "Product E", price: 999, stock: 65 },
];

const stats = {
  totalOrders: 150,
  totalRevenue: 85000,
  totalCustomers: 320,
  avgOrderValue: 567,
};

export function Dashboard() {
  const [dateFilter, setDateFilter] = useState('last30');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'today': return 'Today';
      case 'last7': return 'Last 7 Days';
      case 'last30': return 'Last 30 Days';
      default: return 'Last 30 Days';
    }
  };

  const handleExport = () => {
    alert("Exporting report... (dummy)");
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Overview of your business metrics</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Date Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{getDateFilterLabel()}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => { setDateFilter('today'); setShowDateDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => { setDateFilter('last7'); setShowDateDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => { setDateFilter('last30'); setShowDateDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Last 30 Days
                </button>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{stats.totalOrders.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-green-600 mt-1">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-xl font-bold text-blue-600 mt-1">{stats.totalCustomers.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-xl font-bold text-purple-600 mt-1">
                ₹{stats.avgOrderValue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-md font-semibold text-gray-900">Revenue</h3>
              <p className="text-sm text-gray-600">Income vs Expenses analysis</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={12} stroke="#6b7280" />
                <YAxis fontSize={12} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Line type="monotone" dataKey="expenses" stroke="#9ca3af" strokeWidth={2} name="Expenses" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2} name="Income" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Summary Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-md font-semibold text-gray-900">Order Summary</h3>
              <p className="text-sm text-gray-600">Completed vs Pending orders</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderSummaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} stroke="#6b7280" />
                <YAxis fontSize={12} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Bar dataKey="completed" fill="#6366f1" name="Completed" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" fill="#9ca3af" name="Pending" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    No recent orders to display
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded bg-gray-50 flex items-center justify-center text-indigo-700 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-600">
                  In Stock: {product.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
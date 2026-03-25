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

import {
  useGetDashboardStatsQuery,
  useGetTopProductsQuery,
  useGetRecentOrdersQuery,
  useLazyExportReportQuery
} from '../services/dashboardApi';

export function Dashboard() {
  const [dateFilter, setDateFilter] = useState('last30');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Calculate date range based on filter
  const dateRange = useMemo(() => {
    const today = new Date();
    let startDate = new Date(today);

    switch (dateFilter) {
      case 'today': break;
      case 'last7': startDate.setDate(today.getDate() - 7); break;
      case 'last30':
      default: startDate.setDate(today.getDate() - 30);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    };
  }, [dateFilter]);

  // API Calls
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError
  } = useGetDashboardStatsQuery(dateRange);

  const {
    data: topProductsData = [],
    isLoading: productsLoading
  } = useGetTopProductsQuery();

  const {
    data: recentOrdersData = [],
    isLoading: ordersLoading
  } = useGetRecentOrdersQuery(dateRange);

  const [triggerExport] = useLazyExportReportQuery();

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'today': return 'Today';
      case 'last7': return 'Last 7 Days';
      case 'last30': return 'Last 30 Days';
      default: return 'Last 30 Days';
    }
  };

  // Export Function
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await triggerExport(dateRange).unwrap();

      const blob = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-report-${dateRange.startDate}-to-${dateRange.endDate}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("✅ Report downloaded successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("❌ Failed to export report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Extract totals from the correct path
  const totals = statsData?.totals ?? {};

  const stats = {
    totalOrders: totals.totalOrders ?? 0,
    totalRevenue: totals.totalRevenue ?? 0,
    totalCustomers: totals.noOfCustomers ?? 0,
    avgOrderValue: totals.averageOrderValue ?? 0,
  };

  const recentOrders = statsData?.recentOrders || recentOrdersData || [];
  const topProducts = Array.isArray(topProductsData)
    ? topProductsData
    : topProductsData?.topProducts || topProductsData?.data?.topProducts || [];

  // ✅ Revenue Chart Data
  const revenueData = (statsData?.monthwiseIncome || []).map((item) => ({
    month: item.month?.slice(5),
    income: item.income || 0,
    expenses: 0,
  }));

  // ✅ Order Summary Chart Data
  const orderSummaryData = (statsData?.monthwiseOrderSummary || []).map((item) => ({
    date: item.month?.slice(5),
    completed: item.completed || 0,
    pending: item.pending || 0,
  }));

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Overview of your business metrics</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
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
                {['today', 'last7', 'last30'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setDateFilter(filter); setShowDateDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {filter === 'today' ? 'Today' : filter === 'last7' ? 'Last 7 Days' : 'Last 30 Days'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors shadow-sm text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* Stat Cards - Now using correct totals data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <div className="col-span-4 text-center py-12 text-gray-500">Loading dashboard stats...</div>
        ) : statsError ? (
          <div className="col-span-4 text-center py-12 text-red-500">Failed to load dashboard data</div>
        ) : (
          <>
            <StatCard
              title="Total Orders"
              value={totals.totalOrders?.toLocaleString() || 0}
              icon={<ShoppingCart className="h-6 w-6 text-indigo-600" />}
              color="indigo"
            />
            <StatCard
              title="Revenue"
              value={`₹${(totals.totalRevenue || 0).toLocaleString('en-IN')}`}
              icon={<DollarSign className="h-6 w-6 text-green-600" />}
              color="green"
            />
            <StatCard
              title="Customers"
              value={totals.noOfCustomers?.toLocaleString() || 0}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              color="blue"
            />
            <StatCard
              title="Avg Order Value"
              value={`₹${(totals.averageOrderValue || 0).toLocaleString('en-IN')}`}
              icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
              color="purple"
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-600">Income vs Expenses (Last 7 Months)</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="expenses" stroke="#9ca3af" strokeWidth={2.5} name="Expenses" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2.5} name="Income" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              <p className="text-sm text-gray-600">Completed vs Pending Orders</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderSummaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                <Bar dataKey="completed" fill="#6366f1" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#9ca3af" name="Pending" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
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
                {ordersLoading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-500">Loading recent orders...</td></tr>
                ) : recentOrders.length > 0 ? (
                  recentOrders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">#{order.orderNumber || order._id?.slice(-6)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{order.customer?.phone || 'N/A'}</td>
                      <td className="px-4 py-3 font-medium">₹{(order.finalAmount || order.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${['completed', 'delivered'].includes((order.orderStatus || '').toLowerCase())
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                          }`}>
                          {order.orderStatus || 'Placed'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-500">No recent orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {productsLoading ? (
              <div className="text-center py-12 text-gray-500">Loading top products...</div>
            ) : topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product._id || index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.dishName || product.name}</p>
                      <p className="text-sm text-gray-500">₹{product.price?.toLocaleString('en-IN') || '0'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-emerald-600">
                      Sold: {product.soldQuantity || 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">No top products found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-2xl bg-${color}-100 flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);
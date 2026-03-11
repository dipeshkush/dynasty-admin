// src/pages/Reports.jsx

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Download,
  BarChart3,
  TrendingUp,
  Package,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dummy data (replace with real API data later)
const dummyStats = {
  totalOrders: 1245,
  totalRevenue: 458900,
  totalCustomers: 872,
  avgOrderValue: 368.5,
};

const dummyRevenueData = [
  { name: "Jan", revenue: 12000 },
  { name: "Feb", revenue: 19000 },
  { name: "Mar", revenue: 15000 },
  { name: "Apr", revenue: 22000 },
  { name: "May", revenue: 28000 },
  { name: "Jun", revenue: 32000 },
];

const dummyTopSelling = [
  { name: "Product A", value: 420 },
  { name: "Product B", value: 380 },
  { name: "Product C", value: 310 },
  { name: "Product D", value: 250 },
];

const dummyBranchPerformance = [
  { name: "Indore Main", orders: 520, revenue: 185000 },
  { name: "Vijay Nagar", orders: 380, revenue: 142000 },
  { name: "Palasia", orders: 210, revenue: 89000 },
];

const dummyOrdersByStatus = [
  { status: "Delivered", count: 980, percentage: "78%", color: "#10B981" },
  { status: "Pending", count: 145, percentage: "12%", color: "#F59E0B" },
  { status: "Cancelled", count: 85, percentage: "7%", color: "#EF4444" },
  { status: "Returned", count: 35, percentage: "3%", color: "#8B5CF6" },
];

const dummyNewVsReturning = [
  { name: "New", value: 320, color: "#6366F1" },
  { name: "Returning", value: 552, color: "#10B981" },
];

const dummyHighValueCustomers = [
  { initials: "RS", name: "Rohit Sharma", orders: 42, revenue: 128500, vip: true },
  { initials: "AM", name: "Aarav Mehta", orders: 28, revenue: 98500, vip: false },
  { initials: "RP", name: "Riya Patel", orders: 19, revenue: 67500, vip: true },
];

const dummyPeakHours = [
  { hour: "10 AM", orders: 145 },
  { hour: "11 AM", orders: 180 },
  { hour: "12 PM", orders: 210 },
  { hour: "1 PM", orders: 195 },
  { hour: "2 PM", orders: 165 },
  { hour: "6 PM", orders: 230 },
  { hour: "7 PM", orders: 190 },
];

const pieColors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export function Reports() {
  const [membership, setMembership] = useState("all");
  const [dateRange, setDateRange] = useState("year");
  const [activeTab, setActiveTab] = useState("overview");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-12-31");

  // Simulate loading/error states (replace with real hook)
  const loading = false;
  const error = null;

  const data = {
    stats: dummyStats,
    revenueData: dummyRevenueData,
    topSellingProducts: dummyTopSelling,
    branchPerformance: dummyBranchPerformance,
    ordersByStatus: dummyOrdersByStatus,
    newVsReturningData: dummyNewVsReturning,
    highValueCustomers: dummyHighValueCustomers,
    peakHoursData: dummyPeakHours,
  };

  useEffect(() => {
    setShowCustomRange(dateRange === "custom");
  }, [dateRange]);

  const handleApplyFilters = () => {
    // You can call refetch or update query here with real API
    console.log("Filters applied:", { membership, dateRange, fromDate, toDate });
  };

  const handleRefresh = () => {
    alert("Reports refreshed (dummy)");
  };

  const handleExport = () => {
    alert("Exporting reports... (dummy)");
  };

  const stats = data?.stats || { totalOrders: 0, totalRevenue: 0, totalCustomers: 0 };
  const revenueData = data?.revenueData || [];
  const topSellingProducts = data?.topSellingProducts || [];
  const branchPerformance = data?.branchPerformance || [];
  const ordersByStatus = data?.ordersByStatus || [];
  const newVsReturningData = data?.newVsReturningData || [];
  const highValueCustomers = data?.highValueCustomers || [];
  const peakHoursData = data?.peakHoursData || [];

  const renderLoading = () => (
    <div className="p-6 space-y-6">
      <div className="h-32 w-full bg-gray-200 animate-pulse rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 w-full bg-gray-200 animate-pulse rounded-xl" />
        <div className="h-80 w-full bg-gray-200 animate-pulse rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Detailed insights into your business performance</p>
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
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[180px]">
            <select
              value={membership}
              onChange={(e) => setMembership(e.target.value)}
              className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-white focus:outline-none focus:border-indigo-400 appearance-none pr-10"
            >
              <option value="all">All Membership</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative min-w-[160px]">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-white focus:outline-none focus:border-indigo-400 appearance-none pr-10"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {showCustomRange && (
            <>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-indigo-400"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-indigo-400"
              />
            </>
          )}

          <button
            onClick={handleApplyFilters}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? "..." : stats.totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <ShoppingCart size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{loading ? "..." : stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? "..." : stats.totalCustomers.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Products Sold</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? "..." : "3,450"}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
              <Package size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Pill-shaped Tabs - exact style from your screenshot */}
      <div className="flex justify-center mb-6 ">
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1.5 shadow-inner ">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
              activeTab === "overview"
                ? "bg-white text-indigo-700 shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("sales")}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
              activeTab === "sales"
                ? "bg-white text-indigo-700 shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
            }`}
          >
            Sales Reports
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
              activeTab === "customers"
                ? "bg-white text-indigo-700 shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
            }`}
          >
            Customer Reports
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
              activeTab === "orders"
                ? "bg-white text-indigo-700 shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
            }`}
          >
            Order Reports
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          {loading ? (
            renderLoading()
          ) : error ? (
            <div className="text-center py-12 text-red-600">Error: {error}</div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-medium mb-4">Revenue Trend</h3>
                    {revenueData.length > 0 ? (
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500 text-sm">
                        No revenue data available
                      </div>
                    )}
                  </div>

                  {/* Top Selling Products */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-medium mb-4">Top Selling Products</h3>
                    {topSellingProducts.length > 0 ? (
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-full sm:w-1/2 h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={topSellingProducts}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {topSellingProducts.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="w-full sm:w-1/2 space-y-3">
                          {topSellingProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: pieColors[index % pieColors.length] }}
                                />
                                <span className="text-sm truncate">{product.name}</span>
                              </div>
                              <span className="text-sm font-medium">{product.value} units</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-80 flex items-center justify-center text-gray-500 text-sm">
                        No product data available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "sales" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Branch Performance</h3>
                      <button className="px-3 py-1.5 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                        Export CSV
                      </button>
                    </div>
                    <div className="space-y-3">
                      {branchPerformance.length > 0 ? (
                        branchPerformance.map((branch, index) => (
                          <div key={index} className="shadow rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-sm">{branch.name}</h4>
                                <p className="text-xs text-gray-500">{branch.orders} orders</p>
                              </div>
                              <p className="font-medium">₹{branch.revenue.toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">No branch data</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-medium mb-6">Average Order Value</h3>
                    <div className="text-center py-8">
                      <h2 className="text-4xl font-bold text-indigo-700 mb-2">
                        ₹{stats.avgOrderValue ? stats.avgOrderValue.toFixed(2) : "0.00"}
                      </h2>
                      <p className="text-sm text-gray-500">Based on filtered data</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "customers" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-medium mb-6">New vs Returning Customers</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={newVsReturningData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {newVsReturningData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-medium mb-4">High-Value Customers</h3>
                    <div className="space-y-3">
                      {highValueCustomers.map((customer, index) => (
                        <div key={index} className="shadow rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-indigo-700">{customer.initials}</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{customer.name}</h4>
                                <p className="text-xs text-gray-500">{customer.orders} orders</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{customer.revenue.toLocaleString()}</p>
                              {customer.vip && <span className="text-yellow-600 text-xs">★ VIP</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-medium mb-6">Orders by Status</h3>
                    <div className="space-y-4">
                      {ordersByStatus.map((status, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color }} />
                            <span className="text-sm">{status.status}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{status.count.toLocaleString()}</span>
                            <span className="text-xs text-gray-500 w-12 text-right">{status.percentage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="font-medium mb-4">Peak Order Hours</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={peakHoursData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                          <XAxis dataKey="hour" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="orders" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function renderLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-32 w-full bg-gray-200 animate-pulse rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 w-full bg-gray-200 animate-pulse rounded-xl" />
        <div className="h-80 w-full bg-gray-200 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
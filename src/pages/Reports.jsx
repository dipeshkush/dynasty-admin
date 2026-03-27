// src/pages/Reports.jsx
import { useState, useMemo } from "react";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Download,
  RefreshCw,
  Calendar,
  ChevronDown,
  Crown,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function Reports() {
  const [activeTab, setActiveTab] = useState("sales"); // "sales" or "subscription"
  const [dateRange, setDateRange] = useState("last30");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // Dummy Data (baad mein real API se replace kar denge)
  const stats = {
    totalOrders: 1245,
    totalRevenue: 458900,
    totalCustomers: 872,
    avgOrderValue: 368.5,
  };

  // Sales Report Data
  const salesRevenueData = [
    { month: "Jan", revenue: 45000, orders: 320 },
    { month: "Feb", revenue: 62000, orders: 410 },
    { month: "Mar", revenue: 58000, orders: 380 },
    { month: "Apr", revenue: 71000, orders: 490 },
    { month: "May", revenue: 89000, orders: 620 },
    { month: "Jun", revenue: 95000, orders: 680 },
  ];

  const salesByCategory = [
    { name: "Milk & Dairy", value: 45, color: "#6366F1" },
    { name: "Snacks", value: 28, color: "#10B981" },
    { name: "Beverages", value: 18, color: "#F59E0B" },
    { name: "Groceries", value: 9, color: "#EF4444" },
  ];

  // Subscription Report Data
  const subscriptionData = [
    { month: "Jan", newSubs: 45, activeSubs: 210 },
    { month: "Feb", newSubs: 62, activeSubs: 245 },
    { month: "Mar", newSubs: 58, activeSubs: 280 },
    { month: "Apr", newSubs: 71, activeSubs: 320 },
    { month: "May", newSubs: 89, activeSubs: 380 },
    { month: "Jun", newSubs: 95, activeSubs: 420 },
  ];

  const subscriptionPlans = [
    { name: "30 Days Premium", count: 185, revenue: 92500, color: "#8B5CF6" },
    { name: "90 Days Premium", count: 98, revenue: 147000, color: "#6366F1" },
    { name: "Yearly Premium", count: 42, revenue: 126000, color: "#10B981" },
  ];

  const getDateLabel = () => {
    switch (dateRange) {
      case "today": return "Today";
      case "last7": return "Last 7 Days";
      case "last30": return "Last 30 Days";
      case "month": return "This Month";
      case "year": return "This Year";
      default: return "Last 30 Days";
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Business insights and performance metrics</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Date Filter */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              {getDateLabel()}
              <ChevronDown className="h-4 w-4" />
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                {["last7", "last30", "month", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setShowDateDropdown(false);
                    }}
                    className="w-full text-left px-5 py-2.5 hover:bg-gray-50 text-sm"
                  >
                    {range === "last7" && "Last 7 Days"}
                    {range === "last30" && "Last 30 Days"}
                    {range === "month" && "This Month"}
                    {range === "year" && "This Year"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button> */}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold mt-2">{stats.totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingCart className="h-10 w-10 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold mt-2">{stats.totalCustomers.toLocaleString()}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-semibold mt-2">₹{stats.avgOrderValue}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 rounded-full p-1.5">
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-8 py-3 text-sm font-medium rounded-full transition-all ${activeTab === "sales" ? "bg-white shadow text-indigo-700" : "text-gray-600 hover:bg-white/60"
              }`}
          >
            Overall Sales
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`px-8 py-3 text-sm font-medium rounded-full transition-all ${activeTab === "subscription" ? "bg-white shadow text-indigo-700" : "text-gray-600 hover:bg-white/60"
              }`}
          >
            Subscription Reports
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {activeTab === "sales" && (
          <div className="space-y-8">
            <h2 className="text-lg font-semibold text-gray-900">Overall Sales Performance</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Side - Only Chart */}
              <div className="lg:col-span-7">
                <h3 className="font-medium mb-4">Monthly Revenue Trend</h3>
                <div className="h-96 bg-gray-50 rounded-xl p-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Side - Content / Summary */}
              <div className="lg:col-span-5 space-y-6">

                {/* Sales Summary Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium text-gray-700 mb-5">Sales Summary</h3>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue This Period</span>
                      <span className="font-semibold text-lg">₹2,45,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="font-semibold text-lg">1,845</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Order Value</span>
                      <span className="font-semibold text-lg">₹368.50</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-gray-600">Growth from last month</span>
                      <span className="text-green-600 font-medium">+12.4%</span>
                    </div>
                  </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium text-gray-700 mb-4">Sales by Category</h3>
                  <div className="space-y-4">
                    {salesByCategory.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="font-semibold">{category.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="space-y-8">
            <h2 className="text-lg font-semibold text-gray-900">Subscription Performance</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subscription Growth */}
              <div>
                <h3 className="font-medium mb-4">Subscription Growth Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subscriptionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="newSubs" fill="#7C3AED" name="New Subscriptions" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="activeSubs" fill="#10B981" name="Active Subscriptions" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subscription Plans Breakdown */}
              <div>
                <h3 className="font-medium mb-4">Subscription Plans Breakdown</h3>
                <div className="space-y-4 mt-6">
                  {subscriptionPlans.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-gray-500">{plan.count} subscribers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">₹{plan.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
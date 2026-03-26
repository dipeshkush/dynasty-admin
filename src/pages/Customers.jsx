import { useState } from 'react';
import {
  Search,
  RefreshCw,
  Download,
  Loader2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Users,
  UserCheck,
  Repeat,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Truck,
  Crown,
  Star,
  Percent,
  Diamond,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import {
  useGetAllCustomersQuery,
  useToggleCustomerMutation,
} from "../services/customerApi";

export function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [togglingId, setTogglingId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useGetAllCustomersQuery({ page, limit });

  const [toggleCustomer] = useToggleCustomerMutation();

  const customers = data?.customers || [];
  const totalCustomers = data?.total || customers.length;
  const totalPages = Math.ceil(totalCustomers / limit);

  // Client-side Filtering
  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (customer.fullName || '').toLowerCase().includes(query) ||
      (customer.email || '').toLowerCase().includes(query) ||
      (customer.phone || '').toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'Active' && customer.isEnabled) ||
      (statusFilter === 'Inactive' && !customer.isEnabled);

    const matchesMembership =
      membershipFilter === 'all' ||
      (customer.membership || '').toLowerCase() === membershipFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesMembership;
  });

  const getTierElement = (customer) => {
    const membership = customer?.activeMembership;

    if (!membership) {
      return (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Truck className="h-4 w-4" />
          <span className="font-medium text-sm">No Membership</span>
        </div>
      );
    }

    // Simple color logic based on keyword (optional)
    let colorClass = 'text-indigo-600';
    if (membership.toLowerCase().includes('premium')) {
      colorClass = 'text-violet-600';
    } else if (membership.toLowerCase().includes('platinum')) {
      colorClass = 'text-slate-700';
    }

    return (
      <div className="flex items-center gap-1.5">
        <Crown className={`h-4 w-4 ${colorClass}`} />  
        <span className={`font-medium text-sm ${colorClass}`}>
          {membership} 
        </span>
      </div>
    );
  };

  const handleRefresh = () => refetch();

  // ✅ Simple & Working Export (Direct URL)
  const handleExport = () => {
    setExporting(true);

    const exportUrl = `https://api-dynasty.webseeder.tech/api/admin/customers/export?page=${page}&limit=${limit}`;

    try {
      const link = document.createElement('a');
      link.href = exportUrl;
      link.setAttribute('download', `customers_page_${page}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleViewCustomer = (id) => {
    navigate(`/customers/${id}`);
  };

  const handleToggleStatus = async (id) => {
    if (!window.confirm("Are you sure you want to toggle this customer's status?")) return;

    try {
      setTogglingId(id);
      await toggleCustomer(id).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.message || "Failed to toggle customer status");
    } finally {
      setTogglingId(null);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const goToPrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage customer profiles, membership, and order history
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw size={14} />}
            Refresh
          </button>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={14} />
                Export Current Page
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards - Same UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {customers.filter(c => c.isEnabled).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Returning</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {customers.filter(c => (c.totalOrders || 0) > 1).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Repeat size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">High-Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {customers.filter(c => (c.totalSpent || 0) > 10000).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Same UI */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="relative min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-gray-50 focus:outline-none focus:border-indigo-400 appearance-none pr-10"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative min-w-[180px]">
            <select
              value={membershipFilter}
              onChange={(e) => setMembershipFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-lg text-sm px-4 py-2.5 bg-gray-50 focus:outline-none focus:border-indigo-400 appearance-none pr-10"
            >
              <option value="all">All Membership</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="Diamond">Diamond</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Info & Limit */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <div>
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCustomers)} of {totalCustomers} customers
        </div>

        <div className="flex items-center gap-2">
          <label>Show:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table - UI same rakhi hai */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Customer</th>
              <th className="px-6 py-3 text-left font-medium">Contact</th>
              <th className="px-6 py-3 text-left font-medium">Membership</th>
              <th className="px-6 py-3 text-left font-medium">Orders</th>
              <th className="px-6 py-3 text-left font-medium">Total Spend</th>
              <th className="px-6 py-3 text-left font-medium">priority</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-red-600">
                  Failed to load customers
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  onClick={() => handleViewCustomer(customer._id)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                        {(customer.fullName || 'U').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.fullName || "N/A"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-2 text-gray-600">
                    <div>
                      <p>{customer.phone || "N/A"}</p>
                      <p className="text-xs text-gray-500">{customer.email || "N/A"}</p>
                    </div>
                  </td>

                  <td className="px-6 py-2">
                    {getTierElement(customer)}
                  </td>

                  <td className="px-6 py-2 font-medium">{customer.totalOrders || 0}</td>

                  <td className="px-6 py-2 font-medium text-indigo-600">
                    ₹{(customer.totalSpent || 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-2 text-gray-600">
                    {customer.priority || "N/A"}
                  </td>

                  <td className="px-6 py-2">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-3xl ${customer.isEnabled
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {customer.isEnabled ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCustomer(customer._id);
                        }}
                        className="p-2 hover:bg-indigo-50 rounded transition-colors"
                      >
                        <Eye size={18} className="text-indigo-600" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(customer._id);
                        }}
                        disabled={togglingId === customer._id}
                        className="p-2 hover:bg-gray-50 rounded transition-colors"
                      >
                        {togglingId === customer._id ? (
                          <Loader2 size={18} className="animate-spin text-gray-500" />
                        ) : customer.isEnabled ? (
                          <ToggleRight size={20} className="text-green-600" />
                        ) : (
                          <ToggleLeft size={20} className="text-red-600" />
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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={goToPrevPage}
          disabled={page === 1}
          className="flex items-center gap-2 px-5 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Page <span className="font-semibold text-gray-900">{page}</span> of {totalPages || 1}
        </div>

        <button
          onClick={goToNextPage}
          disabled={page === totalPages || totalPages === 0}
          className="flex items-center gap-2 px-5 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
// src/pages/Customers.jsx

import { useState } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  Users,
  UserCheck,
  Repeat,
  TrendingUp,
  Phone,
  Calendar,
  Filter,
  ChevronDown,
  Eye,
  RefreshCw,
  Download,
  Crown,
  Star,
  Percent,
  Diamond,
  Truck,
} from 'lucide-react';

// Dummy customers data
const dummyCustomers = [
  {
    id: 1,
    name: 'Riya Sharma',
    initials: 'PS',
    email: 'pallavi.sharma@gmail.com',
    phone: '+91 98765 43210',
    membership: 'Platinum',
    totalOrders: 42,
    totalSpent: 28500,
    lastOrderDate: '2026-03-05',
    status: 'Active',
    customerType: 'High-Value',
  },
  {
    id: 2,
    name: 'Aarav Mehta',
    initials: 'AM',
    email: 'aarav.mehta@yahoo.com',
    phone: '+91 87654 32109',
    membership: 'Gold',
    totalOrders: 28,
    totalSpent: 14800,
    lastOrderDate: '2026-02-28',
    status: 'Active',
    customerType: 'Returning',
  },
  {
    id: 3,
    name: 'Unknown User',
    initials: 'U',
    email: 'guest123@example.com',
    phone: 'N/A',
    membership: 'Bronze',
    totalOrders: 5,
    totalSpent: 1200,
    lastOrderDate: '2026-03-01',
    status: 'Inactive',
    customerType: 'New',
  },
  {
    id: 4,
    name: 'Riya Patel',
    initials: 'RP',
    email: 'riya.patel@outlook.com',
    phone: '+91 76543 21098',
    membership: 'Silver',
    totalOrders: 15,
    totalSpent: 6200,
    lastOrderDate: '2026-03-04',
    status: 'Active',
    customerType: 'Returning',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    initials: 'VS',
    email: 'vikram.singh@gmail.com',
    phone: '+91 65432 10987',
    membership: 'Diamond',
    totalOrders: 67,
    totalSpent: 45200,
    lastOrderDate: '2026-03-07',
    status: 'Active',
    customerType: 'High-Value',
  },
];

export function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Filter logic (client-side)
  const filteredCustomers = dummyCustomers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'all' || customer.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesMembership =
      membershipFilter === 'all' ||
      customer.membership.toLowerCase() === membershipFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesMembership;
  });

  // Membership tier UI helper
  const getTierElement = (tierName) => {
    const name = tierName?.toLowerCase() || 'bronze';
    let Icon = Truck;
    let colorClass = 'text-indigo-600';
    let bgClass = 'bg-indigo-100';

    if (name.includes('platinum')) {
      Icon = Crown;
      colorClass = 'text-slate-700';
      bgClass = 'bg-slate-100';
    } else if (name.includes('gold')) {
      Icon = Crown;
      colorClass = 'text-yellow-600';
      bgClass = 'bg-yellow-100';
    } else if (name.includes('silver')) {
      Icon = Star;
      colorClass = 'text-gray-500';
      bgClass = 'bg-gray-100';
    } else if (name.includes('bronze')) {
      Icon = Percent;
      colorClass = 'text-amber-700';
      bgClass = 'bg-amber-100';
    } else if (name.includes('diamond')) {
      Icon = Diamond;
      colorClass = 'text-indigo-700';
      bgClass = 'bg-indigo-100';
    }

    return (
      <div className="flex items-center gap-1.5">
        <Icon className={`h-4 w-4 ${colorClass}`} />
        <span className={`font-medium text-sm ${colorClass}`}>
          {tierName || 'Bronze'}
        </span>
      </div>
    );
  };

  const handleRefresh = () => {
    alert('Customers refreshed (dummy)');
  };

  const handleExport = () => {
    alert('Exporting customers... (dummy)');
  };

  const handleViewCustomer = (id) => {
    alert(`Viewing customer ID: ${id} (dummy)`);
  };

  const handleEditCustomer = (id) => {
    alert(`Editing customer ID: ${id} (dummy)`);
  };

  const handleDeleteCustomer = (id) => {
    if (confirm(`Delete customer ID: ${id}?`)) {
      alert(`Customer ${id} deleted (dummy)`);
    }
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dummyCustomers.length}</p>
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
                {dummyCustomers.filter(c => c.status === 'Active').length}
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
                {dummyCustomers.filter(c => c.customerType === 'Returning').length}
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
                {dummyCustomers.filter(c => c.customerType === 'High-Value').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          {/* Search */}
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

          {/* Status Filter */}
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

          {/* Membership Filter */}
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

      {/* Results count & entries selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-600">
        <div>
          Showing {Math.min(filteredCustomers.length, entriesPerPage)} of {filteredCustomers.length} customers
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

      {/* Table - same UI as you gave */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Customer</th>
              <th className="px-6 py-3 text-left font-medium">Contact</th>
              <th className="px-6 py-3 text-left font-medium">Membership</th>
              <th className="px-6 py-3 text-left font-medium">Orders</th>
              <th className="px-6 py-3 text-left font-medium">Total Spend</th>
              <th className="px-6 py-3 text-left font-medium">Last Order</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.slice(0, entriesPerPage).map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                        {customer.initials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        {customer.customerType && (
                          <span className="text-xs text-gray-500">{customer.customerType}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-2 text-gray-600">
                    <div>
                      <p>{customer.phone}</p>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                    </div>
                  </td>

                  <td className="px-6 py-2">
                    {getTierElement(customer.membership)}
                  </td>

                  <td className="px-6 py-2 font-medium">{customer.totalOrders}</td>

                  <td className="px-6 py-2 font-medium text-indigo-600">
                    ₹{customer.totalSpent.toLocaleString()}
                  </td>

                  <td className="px-6 py-2 text-gray-600">{customer.lastOrderDate}</td>

                  <td className="px-6 py-2">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md border ${
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-6 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 hover:bg-indigo-50 rounded transition-colors">
                        <Eye size={16} className="text-indigo-600" />
                      </button>
                      <button className="p-1.5 hover:bg-indigo-50 rounded transition-colors">
                        <Edit2 size={16} className="text-indigo-600" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} className="text-red-500" />
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
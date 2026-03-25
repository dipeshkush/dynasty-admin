// src/pages/CustomerDetailsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  Phone,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { useGetSingleCustomerQuery } from '../services/customerApi';

export function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetSingleCustomerQuery(id, {
    skip: !id,
  });

  const customer = data?.customer;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="text-xl font-medium text-gray-700">Customer not found</p>
        <button
          onClick={() => navigate('/customers')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Customers
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Customer Details</h1>
      </div>

      {/* TOP GRID - Same Size Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <User className="w-9 h-9 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{customer.fullName}</h2>
              <p className="text-gray-500 text-sm mt-1">{customer.email}</p>
              <span
                className={`inline-block mt-3 px-4 py-1 text-xs font-medium rounded-2xl ${customer.isEnabled
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-600'
                  }`}
              >
                {customer.isEnabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm text-gray-600">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-gray-400" />
              {customer.phone}
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-medium text-gray-900">{customer.customerType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <p className="font-medium text-gray-900 capitalize">{customer.priority}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SUBSCRIPTION CARD */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500 mb-4">Subscription</p>
          {customer.activeSubscription ? (
            <div className="space-y-4">
              <p className="text-xl font-semibold text-gray-900">
                {customer.activeSubscription.planName}
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                ₹{customer.activeSubscription.totalPaid}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(customer.activeSubscription.startDate).toLocaleDateString('en-IN')}
                {' — '}
                {new Date(customer.activeSubscription.endDate).toLocaleDateString('en-IN')}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-lg py-8">No Active Plan</p>
          )}
        </div>

        {/* STATS CARD */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow grid grid-cols-2 gap-6 text-center">
          <div>
            <p className="text-xl font-semibold text-gray-900">{customer.totalOrders}</p>
            <p className="text-xs text-gray-500 mt-1">Total Orders</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">₹{customer.totalSpent}</p>
            <p className="text-xs text-gray-500 mt-1">Total Spent</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-emerald-600">{customer.completedOrdersCount}</p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">
              ₹{customer.totalOrders ? Math.round(customer.totalSpent / customer.totalOrders) : 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg Order</p>
          </div>
        </div>
      </div>

      {/* ADDRESSES */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <p className="text-lg font-semibold mb-5 flex items-center gap-2">
          <MapPin className="text-indigo-600" /> Addresses
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {customer.addresses.map((addr) => (
            <div
              key={addr._id}
              className={`p-5 border rounded-2xl text-sm transition-all ${addr.isDefault
                ? 'border-indigo-200 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex gap-3">
                <MapPin size={20} className="text-gray-400 mt-0.5" />
                <p className="text-gray-700 leading-relaxed">{addr.address}</p>
              </div>
              {addr.isDefault && (
                <span className="mt-4 inline-block text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-xl">
                  Default Address
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ORDERS */}
      {/* RECENT ORDERS - Premium Table (Screenshot Style) */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <p className="text-lg font-semibold">Recent Orders</p>
          <span className="text-xs text-gray-500">Last 10 orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-6 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-3 px-6 text-right font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {customer.orders.slice(0, 10).map((o) => (
                <tr
                  key={o._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Order ID */}
                  <td className="py-2 px-6 font-medium text-gray-900">
                    {o.orderNumber}
                  </td>

                  {/* Status - Pill Style (jaise screenshot mein Role hai) */}
                  <td className="py-2 px-6">
                    <span
                      className={`inline-flex items-center justify-center w-28 h-8 
                text-xs font-semibold rounded-md capitalize
                ${o.orderStatus?.toLowerCase() === 'delivered' ||
                          o.orderStatus?.toLowerCase() === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : o.orderStatus?.toLowerCase() === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : o.orderStatus?.toLowerCase() === 'cancelled'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="py-2 px-6 text-gray-600 font-medium">
                    {o.paymentMethod}
                  </td>

                  {/* Amount */}
                  <td className="py-2 px-6 text-right font-semibold text-gray-900">
                    ₹{Number(o.finalAmount || 0).toLocaleString('en-IN')}
                  </td>

                  {/* Date */}
                  <td className="py-2 px-6 text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customer.orders.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}
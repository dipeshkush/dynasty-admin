// src/pages/OrderDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderDetailQuery, useUpdateOrderStatusMutation } from '../services/ordersApi';
import { ArrowLeft, Calendar, User, MapPin, CreditCard, Package } from 'lucide-react';

const statusOptions = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetOrderDetailQuery(orderId);
  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();

  const order = data?.data;

  const handleStatusChange = async (newStatus) => {
    if (!order) return;
    try {
      await updateStatus({ orderId, status: newStatus }).unwrap();
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading order details...</div>;
  if (isError || !order) return <div className="p-8 text-center text-red-500">Order not found or failed to load.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
      </div>

      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-2xl font-semibold text-gray-900">#{order.orderNumber}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
              order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {order.orderStatus}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Customer</p>
              <p className="font-medium">{order.customer?.firstName} {order.customer?.lastName}</p>
              <p className="text-sm text-gray-600">{order.customer?.phone}</p>
              <p className="text-sm text-gray-600">{order.customer?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" /> Order Items
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.variant && (
                      <p className="text-sm text-gray-500">{item.variant.label}</p>
                    )}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Summary & Status */}
        <div className="space-y-6">
          {/* Amount Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Amount Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
              {order.discountApplied > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Applied</span>
                  <span>- ₹{order.discountApplied}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-3">
                <span>Final Amount</span>
                <span>₹{order.finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Delivery Address
            </h3>
            <div className="text-sm text-gray-600">
              <p>{order.address.name}</p>
              <p>{order.address.flat}, {order.address.area}</p>
              <p>{order.address.city} - {order.address.pincode}</p>
              <p className="mt-1 text-xs text-gray-500">Type: {order.address.type}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Payment Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold mb-3">Update Order Status</h3>
            <select
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
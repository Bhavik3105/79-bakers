// pages/admin/orders.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function OrdersManagement() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update order');
      }

      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Package className="w-5 h-5 text-purple-600" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-purple-100 text-purple-700';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders
    .filter(order => 
      filterStatus === 'all' || order.orderStatus === filterStatus
    )
    .filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8 text-pink-600" />
            <h1 className="text-4xl font-bold text-gray-800">Orders Management</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-pink-600">{orders.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number, customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Order #</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Items</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-pink-50 transition"
                  >
                    <td className="px-6 py-4 font-mono font-semibold text-gray-800">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{order.customerInfo.name}</p>
                        <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.items.length} item(s)
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                        </div>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${getStatusColor(order.orderStatus)} border-0 focus:ring-2 focus:ring-pink-500`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                        className="p-2 text-pink-600 hover:bg-pink-100 rounded-lg transition"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

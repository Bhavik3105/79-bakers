import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Search,
  Calendar,
  ShoppingBag,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/orders');
      } else {
        fetchOrders();
      }
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?email=${user.email}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-pink-900 mb-2 flex items-center gap-3">
            <ShoppingBag className="w-10 h-10" />
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your cake orders</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition"
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
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <ShoppingBag className="w-24 h-24 text-pink-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-pink-900 mb-4">
              {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
            </h2>
            <p className="text-gray-600 mb-8">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start ordering delicious cakes!'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link href="/">
                <Button>Browse Cakes</Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{order.orderNumber}</h3>
                      <div className="flex items-center gap-2 text-pink-100">
                        <Calendar className="w-4 h-4" />
                        <span>Ordered on {formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                      <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 font-semibold ${getStatusColor(order.orderStatus)} bg-white`}>
                        {getStatusIcon(order.orderStatus)}
                        {formatStatus(order.orderStatus)}
                      </div>
                      <div className="text-pink-100 text-sm">
                        Total: ₹{order.totalAmount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  {/* Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-pink-900 mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-pink-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-pink-900">{item.name}</h5>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-pink-600 font-semibold">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-pink-900 mb-2">Delivery Address</h4>
                      <p className="text-gray-700 text-sm">
                        {order.deliveryAddress.address}<br />
                        {order.deliveryAddress.city}, {order.deliveryAddress.pincode}
                        {order.deliveryAddress.landmark && <><br />Near {order.deliveryAddress.landmark}</>}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-900 mb-2">Delivery Schedule</h4>
                      <p className="text-gray-700 text-sm">
                        {formatDate(order.deliveryDate)}<br />
                        {order.deliveryTime === 'morning' && 'Morning (9 AM - 12 PM)'}
                        {order.deliveryTime === 'afternoon' && 'Afternoon (12 PM - 4 PM)'}
                        {order.deliveryTime === 'evening' && 'Evening (4 PM - 8 PM)'}
                      </p>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {(order.cakeMessage || order.specialInstructions) && (
                    <div className="mb-6">
                      {order.cakeMessage && (
                        <div className="mb-3">
                          <h4 className="font-semibold text-pink-900 mb-1">Cake Message</h4>
                          <p className="text-gray-700 text-sm italic">"{order.cakeMessage}"</p>
                        </div>
                      )}
                      {order.specialInstructions && (
                        <div>
                          <h4 className="font-semibold text-pink-900 mb-1">Special Instructions</h4>
                          <p className="text-gray-700 text-sm">{order.specialInstructions}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Link href={`/orders/${order._id}`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

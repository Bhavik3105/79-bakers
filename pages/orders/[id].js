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
  MapPin,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  ChevronLeft,
  Download,
  CreditCard,
  User
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function OrderDetail() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/orders');
      } else if (id) {
        fetchOrder();
      }
    }
  }, [user, authLoading, id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      const data = await response.json();
      
      if (data.success) {
        // Verify this order belongs to the user
        if (data.order.customerInfo.email !== user.email && user.role !== 'admin') {
          toast.error('Access denied');
          router.push('/orders');
          return;
        }
        setOrder(data.order);
      } else {
        toast.error('Order not found');
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-purple-500" />;
      case 'out_for_delivery':
        return <Truck className="w-6 h-6 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDeliveryDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOrderProgress = () => {
    const statuses = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];
    const currentIndex = statuses.indexOf(order?.orderStatus);
    return currentIndex >= 0 ? currentIndex : 0;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pink-700 mb-4">Order not found</h1>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderStatuses = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'processing', label: 'Preparing', icon: Package },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const currentProgress = getOrderProgress();

  return (
    <div className="min-h-screen py-24 px-4 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/orders">
            <button className="flex items-center gap-2 text-pink-700 hover:text-pink-900 transition">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Orders</span>
            </button>
          </Link>
        </motion.div>

        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-3xl p-8 mb-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{order.orderNumber}</h1>
              <div className="flex items-center gap-2 text-pink-100">
                <Calendar className="w-4 h-4" />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className={`px-6 py-3 rounded-full border-2 flex items-center gap-2 font-bold text-lg ${getStatusColor(order.orderStatus)} bg-white`}>
                {getStatusIcon(order.orderStatus)}
                {formatStatus(order.orderStatus)}
              </div>
              <div className="text-2xl font-bold">₹{order.totalAmount}</div>
            </div>
          </div>
        </motion.div>

        {/* Order Progress Tracker */}
        {order.orderStatus !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 mb-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-pink-900 mb-8">Order Progress</h2>
            
            {/* Desktop Progress */}
            <div className="hidden md:flex items-center justify-between relative">
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                  style={{ width: `${(currentProgress / (orderStatuses.length - 1)) * 100}%` }}
                />
              </div>
              
              {orderStatuses.map((status, index) => {
                const isActive = index <= currentProgress;
                const Icon = status.icon;
                
                return (
                  <div key={status.key} className="flex flex-col items-center relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                      isActive 
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg scale-110' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-sm font-medium text-center ${
                      isActive ? 'text-pink-900' : 'text-gray-400'
                    }`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Progress */}
            <div className="md:hidden space-y-4">
              {orderStatuses.map((status, index) => {
                const isActive = index <= currentProgress;
                const Icon = status.icon;
                
                return (
                  <div key={status.key} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-medium ${
                      isActive ? 'text-pink-900' : 'text-gray-400'
                    }`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-pink-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-pink-900 text-lg">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-600">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-pink-900 mb-6">Delivery Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-pink-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-pink-900 mb-2">Delivery Address</h3>
                    <p className="text-gray-700">
                      {order.deliveryAddress.address}<br />
                      {order.deliveryAddress.city}, {order.deliveryAddress.pincode}
                      {order.deliveryAddress.landmark && (
                        <><br />Landmark: {order.deliveryAddress.landmark}</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-pink-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-pink-900 mb-2">Delivery Schedule</h3>
                    <p className="text-gray-700">
                      <strong>{formatDeliveryDate(order.deliveryDate)}</strong><br />
                      {order.deliveryTime === 'morning' && 'Morning (9 AM - 12 PM)'}
                      {order.deliveryTime === 'afternoon' && 'Afternoon (12 PM - 4 PM)'}
                      {order.deliveryTime === 'evening' && 'Evening (4 PM - 8 PM)'}
                    </p>
                  </div>
                </div>

                {order.cakeMessage && (
                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-6 h-6 text-pink-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-pink-900 mb-2">Cake Message</h3>
                      <p className="text-gray-700 italic">"{order.cakeMessage}"</p>
                    </div>
                  </div>
                )}

                {order.specialInstructions && (
                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-6 h-6 text-pink-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-pink-900 mb-2">Special Instructions</h3>
                      <p className="text-gray-700">{order.specialInstructions}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1 space-y-8">
            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-xl font-bold text-pink-900 mb-6">Customer Info</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-pink-900">{order.customerInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-pink-900">{order.customerInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-pink-900">{order.customerInfo.phone}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-xl font-bold text-pink-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className={order.deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                  </span>
                </div>
                <div className="border-t-2 border-pink-200 pt-4 flex justify-between font-bold text-xl text-pink-900">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-pink-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-pink-600" />
                  <h3 className="font-semibold text-pink-900">Payment Method</h3>
                </div>
                <p className="text-gray-700">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Status: <span className="capitalize">{order.paymentStatus}</span>
                </p>
              </div>
            </motion.div>

            {/* Need Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl p-8 text-center"
            >
              <h3 className="font-bold text-pink-900 mb-2">Need Help?</h3>
              <p className="text-gray-700 text-sm mb-4">
                Contact us for any questions about your order
              </p>
              <Link href="/contact">
                <Button className="w-full">Contact Support</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

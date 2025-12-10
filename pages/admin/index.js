// pages/admin/index.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  TrendingUp,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
    }
  }, [isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch products count
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();

      // Fetch orders
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();

      const orders = ordersData.orders || [];
      const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalProducts: productsData.total || 0,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        recentOrders: orders.slice(0, 5)
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-pink-600" />
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Welcome back, {user?.name}! 👋</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/products')}
              className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition"
            >
              <Package className="w-6 h-6" />
              <span className="font-semibold">Manage Products</span>
            </button>
            <button
              onClick={() => router.push('/admin/orders')}
              className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="font-semibold">Manage Orders</span>
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition"
            >
              <Users className="w-6 h-6" />
              <span className="font-semibold">View Users</span>
            </button>
            <button
              onClick={() => router.push('/admin/contacts')}
              className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="font-semibold">Contact Forms</span>
            </button>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h2>
          
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-pink-300 transition cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order._id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      order.orderStatus === 'delivered' ? 'bg-green-100' :
                      order.orderStatus === 'pending' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {order.orderStatus === 'delivered' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : order.orderStatus === 'pending' ? (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{order.totalAmount}</p>
                    <p className="text-xs text-gray-500 capitalize">{order.orderStatus}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

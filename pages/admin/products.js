// pages/admin/products.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProductsManagement() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'chocolate',
    inStock: true
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to save product');
      }

      toast.success(editingProduct ? 'Product updated!' : 'Product created!');
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'chocolate',
        inStock: true
      });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: product.inStock
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success('Product deleted!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        {/* Floating Add Button */}
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              image: '',
              category: 'chocolate',
              inStock: true
            });
            setShowModal(true);
          }}
          className="fixed bottom-8 right-8 z-50 flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:from-pink-600 hover:to-rose-600 transition shadow-2xl hover:scale-110"
        >
          <Plus className="w-6 h-6" />
          <span className="font-bold text-lg">Add Product</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Products Management</h1>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Image</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-pink-50 transition"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {product.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.inStock 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Chocolate Truffle Cake"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows="3"
                      placeholder="Delicious chocolate cake..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="699"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="chocolate">Chocolate</option>
                        <option value="eggless">Eggless</option>
                        <option value="fruit">Fruit</option>
                        <option value="customize">Customize</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="/images/cakes/chocolate-truffle.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                      In Stock
                    </label>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition"
                    >
                      <Save className="w-5 h-5" />
                      <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CakeGallery() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setCakes(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (cake) => {
    addToCart(cake, 1);
    toast.success(`Added 1 x ${cake.name} (₹${cake.price}) to cart! 🎂`);
  };

  const filteredCakes = cakes.filter((cake) => {
    const matchesSearch = cake.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filters.category || cake.category === filters.category;

    const matchesPrice =
      !filters.price ||
      (filters.price === 'low' && cake.price < 700) ||
      (filters.price === 'medium' && cake.price >= 700 && cake.price <= 800) ||
      (filters.price === 'high' && cake.price > 800);

    const matchesRating = !filters.rating || cake.rating >= parseFloat(filters.rating);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <FilterBar
        onSearch={(term) => setSearchTerm(term)}
        onFilter={(f) => setFilters(f)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCakes.map((cake, index) => (
          <motion.div
            key={cake._id || cake.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <BackgroundGradient className="rounded-[22px] bg-white p-4 text-center h-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <div className="relative">
                  <img 
                    src={cake.image} 
                    alt={cake.name} 
                    className="w-full h-64 object-cover rounded-md"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Quick View Overlay */}
                  <Link href={`/product/${cake._id || cake.id}`}>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md cursor-pointer">
                      <div className="bg-white text-pink-600 px-4 py-2 rounded-full flex items-center gap-2 font-semibold">
                        <Eye className="w-4 h-4" />
                        Quick View
                      </div>
                    </div>
                  </Link>
                </div>
                <Link href={`/product/${cake._id || cake.id}`}>
                  <h2 className="mt-4 text-lg font-semibold text-gray-800 hover:text-pink-600 transition cursor-pointer">
                    {cake.name}
                  </h2>
                </Link>
                <p className="text-pink-600 font-medium mt-1">₹{cake.price}</p>
                {cake.inStock === false && (
                  <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Link href={`/product/${cake._id || cake.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-pink-100 text-pink-600 rounded-full shadow-md hover:bg-pink-200 transition-all">
                      View Details
                    </button>
                  </Link>
                  <button
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 transform hover:scale-105 transition-all"
                    onClick={() => handleBuyNow(cake)}
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            </BackgroundGradient>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';
import { Eye, TrendingUp } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';


export default function BestSeller() {
    const { addToCart, toggleCart } = useCart();
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = async () => {
        try {
            const response = await fetch('/api/products/best-sellers?limit=6');
            const data = await response.json();
            if (data.success) {
                setBestSellers(data.data);
            }
        } catch (error) {
            console.error('Error fetching best sellers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = (cake) => {
        addToCart({ name: cake.name, price: cake.price }, 1);
        toggleCart();
    };

    if (loading) {
        return (
            <section className="py-12 px-4 bg-pink-50">
                <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner />
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 px-4 bg-pink-50">
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-8 h-8 text-pink-600" />
                    <h2 className="text-3xl font-bold text-pink-700">
                        Best Sellers
                    </h2>
                </div>
                <p className="text-gray-600 text-sm">Most loved by our customers</p>
            </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {bestSellers.map((cake, index) => (
                    <motion.div
                        key={cake.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.4, delay: index * 0.2 }}
                    >
                        <BackgroundGradient className="rounded-[22px] bg-white overflow-hidden cursor-pointer h-full">
                            <motion.div
                                whileHover={{
                                    scale: 1.02,
                                }}
                                transition={{ duration: 0.3 }}
                                className="relative group"
                            >
                                <div className="relative">
                                    {cake.totalSold > 0 && (
                                        <div className="absolute top-2 left-2 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {cake.totalSold} sold
                                        </div>
                                    )}
                                    <Image 
                                        src={cake.image} 
                                        alt={cake.name} 
                                        width={400} 
                                        height={300} 
                                        className="w-full h-64 object-cover"
                                        loading="lazy"
                                        quality={85}
                                    />
                                    {/* Quick View Overlay */}
                                    <Link href={`/product/${cake.id}`}>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <div className="bg-white text-pink-600 px-4 py-2 rounded-full flex items-center gap-2 font-semibold">
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="p-4">
                                    <Link href={`/product/${cake.id}`}>
                                        <h3 className="text-xl font-semibold text-pink-800 hover:text-pink-600 transition cursor-pointer">
                                            {cake.name}
                                        </h3>
                                    </Link>
                                    <p className="text-pink-600 mt-1 font-medium">₹{cake.price}</p>
                                    <div className="flex gap-2 mt-3">
                                        <Link href={`/product/${cake.id}`} className="flex-1">
                                            <button className="w-full bg-pink-100 text-pink-600 py-2 rounded-lg hover:bg-pink-200 transition">
                                                View Details
                                            </button>
                                        </Link>
                                        <button
                                            className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition transform hover:scale-105"
                                            onClick={() => handleBuyNow(cake)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </BackgroundGradient>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const bestSellers = [
    {
        id: 1,
        name: 'Chocolate Truffle Cake',
        price: 699,
        image: '/images/cakes/chocolate-truffle.jpg',
    },
    {
        id: 2,
        name: 'Red Velvet Cake',
        price: 799,
        image: '/images/cakes/red-velvet.jpg',
    },
    {
        id: 3,
        name: 'Butterscotch Delight',
        price: 649,
        image: '/images/cakes/butterscotch.jpg',
    },
];

export default function BestSeller() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const { addToCart, toggleCart } = useCart(); // ✅ corrected

    const handleBuyNow = (cake) => {
        addToCart({ name: cake.name, price: cake.price }, 1); // ✅ fixed
        toggleCart();
    };

    return (
        <section className="py-12 px-4 bg-pink-50" ref={ref}>
            <motion.h2
                className="text-3xl font-bold text-center text-pink-700 mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                Best Sellers
            </motion.h2>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {bestSellers.map((cake, index) => (
                    <motion.div
                        key={cake.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.2 }}
                        whileHover={{
                            scale: 1.03,
                            boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                        }}
                    >
                        <Image src={cake.image} alt={cake.name} width={400} height={300} className="w-full h-64 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-pink-800">{cake.name}</h3>
                            <p className="text-pink-600 mt-1">₹{cake.price}</p>
                            <button
                                className="mt-3 w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
                                onClick={() => handleBuyNow(cake)}
                            >
                                Buy Now
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

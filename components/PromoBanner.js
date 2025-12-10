// components/PromoBanner.js
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function PromoBanner() {
    const { addToCart, toggleCart } = useCart();

    // Promotional cake data
    const chocoCake = {
        name: 'Choco Chip Cake',
        price: 599,
        image: '/images/cakes/choco-chip-banner.jpeg',
    };

    const handleOrderNow = () => {
        addToCart(chocoCake, 1); // ✅ Add 1 quantity
        toggleCart();
        toast.success(`Added ${chocoCake.name} to cart! 🍫🎂`);
    };

    return (
        <div className="mt-12 flex flex-col md:flex-row items-center justify-center bg-pink-100 px-6 py-10 rounded-xl shadow-lg max-w-5xl mx-auto">
            <img
                src={chocoCake.image}
                alt={chocoCake.name}
                className="w-full md:w-1/2 rounded-lg object-cover shadow-md"
            />

            <div className="md:ml-10 mt-6 md:mt-0 text-center md:text-left">
                <h2 className="text-2xl font-bold text-pink-700">
                    Treat Yourself to <br className="hidden md:inline" /> Choco Chip Cake Ecstasy!
                </h2>
                <p className="mt-4 text-gray-700 max-w-md">
                    Experience pure bliss with our Choco Chip Cake. Moist, chocolatey goodness that will leave you craving for more.
                </p>
                <button
                    className="mt-6 px-6 py-2 bg-pink-600 text-white font-semibold rounded-full hover:bg-pink-700 transition shadow-md"
                    onClick={handleOrderNow}
                >
                    Order Now
                </button>
            </div>
        </div>
    );
}

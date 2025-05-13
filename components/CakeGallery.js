import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

const cakes = [
  { name: "Dark Chocolate", image: "/images/cakes/dark-chocolate.jpeg", price: 500, soldOut: false },
  { name: "Dutch Truffle", image: "/images/cakes/dutch-truffle.jpeg", price: 550, soldOut: false },
  { name: "Message Cake", image: "/images/cakes/message-cake.jpeg", price: 600, soldOut: false },
  { name: "Theme Cake", image: "/images/cakes/theme-cake.jpeg", price: 750, soldOut: false },
  { name: "Customize Cake", image: "/images/cakes/customize-cake-novelty.jpeg", price: 850, soldOut: false },
];

export default function CakeGallery() {
  const { addToCart } = useCart();

  const handleBuyNow = (cake) => {
    addToCart(cake, 1); // Always add 1 item to cart
    toast.success(`Added 1 x ${cake.name} (₹${cake.price}) to cart! 🎂`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cakes.map((cake, index) => (
        <div
          key={index}
          className="relative bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
          {cake.soldOut && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Sold Out
            </span>
          )}

          <img
            src={cake.image}
            alt={cake.name}
            className="w-64 h-64 object-cover rounded-md transition-transform duration-300 hover:scale-105"
          />

          <h2 className="mt-4 text-lg font-semibold">{cake.name}</h2>
          <p className="text-pink-600 font-medium mt-1">₹{cake.price}</p>

          {!cake.soldOut && (
            <button
              className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full shadow-md transition"
              onClick={() => handleBuyNow(cake)}
            >
              Buy Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

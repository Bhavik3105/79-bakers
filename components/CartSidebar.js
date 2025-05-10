import { useCart } from '@/context/CartContext';
import { X } from 'lucide-react';

export default function CartSidebar() {
    const {
        cartItems,
        isCartOpen,
        toggleCart,
        removeItem,
        incrementItem,
        decrementItem
    } = useCart();

    const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return (
        <div
            className={`fixed top-0 right-0 w-80 h-full bg-pink-100 shadow-lg transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 z-50`}
        >
            <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-bold text-pink-700">Your Cart</h2>
                <button onClick={toggleCart}>
                    <X />
                </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-150px)]">
                {cartItems.length === 0 ? (
                    <p className="text-pink-700">Your cart is empty!</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                            <div>
                                <h3 className="font-semibold">{item.name}</h3>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 mt-1">
                                    <button
                                        className="bg-pink-300 hover:bg-pink-400 text-white px-2 rounded"
                                        onClick={() => decrementItem(item.name)}
                                    >
                                        -
                                    </button>
                                    <span className="font-medium">{item.quantity}</span>
                                    <button
                                        className="bg-pink-300 hover:bg-pink-400 text-white px-2 rounded"
                                        onClick={() => incrementItem(item.name)}
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-sm text-pink-600 mt-1">
                                    ₹{item.price} each = ₹{item.price * item.quantity}
                                </p>
                            </div>

                            <button
                                className="text-red-500 text-sm hover:underline"
                                onClick={() => removeItem(item.name)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="p-4 border-t">
                    <p className="font-bold text-lg text-pink-800">Total: ₹{totalPrice}</p>
                    <button className="w-full mt-2 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition">
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}

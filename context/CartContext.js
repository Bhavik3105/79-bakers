import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('79bakersCart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        try {
            if (cartItems.length > 0) {
                localStorage.setItem('79bakersCart', JSON.stringify(cartItems));
            } else {
                localStorage.removeItem('79bakersCart');
            }
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [cartItems]);

    const addToCart = (cake, quantity) => {
        setCartItems((prevItems) => {
            const existing = prevItems.find(item => item.name === cake.name);
            if (existing) {
                return prevItems.map(item =>
                    item.name === cake.name ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...prevItems, { ...cake, quantity }];
            }
        });
        setIsCartOpen(true); // Open cart when added
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const removeItem = (name) => {
        setCartItems(cartItems.filter(item => item.name !== name));
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('79bakersCart');
    };

    // ✅ Add: Increment item quantity
    const incrementItem = (name) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.name === name ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // ✅ Add: Decrement item quantity
    const decrementItem = (name) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.name === name && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                toggleCart,
                isCartOpen,
                removeItem,
                incrementItem,
                decrementItem,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

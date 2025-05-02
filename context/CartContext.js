import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

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

    return (
        <CartContext.Provider value={{ cartItems, addToCart, toggleCart, isCartOpen, removeItem }}>
            {children}
        </CartContext.Provider>
    );
}

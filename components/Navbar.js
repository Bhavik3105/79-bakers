'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems, toggleCart } = useCart();

  // 🧮 Calculate total item count
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-[#ffe4e6] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/cakes/logo.png"
            alt="79 Baker's Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-xl md:text-2xl font-bold text-pink-700">79 Baker's</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-pink-800 hover:text-pink-600 transition">Home</Link>
          <Link href="/about" className="text-pink-800 hover:text-pink-600 transition">About</Link>
          <Link href="/contact" className="text-pink-800 hover:text-pink-600 transition">Contact</Link>
          <Link
            href="/order"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Order Now
          </Link>

          {/* Cart Icon with Badge */}
          <button onClick={toggleCart} className="relative ml-4 text-pink-700 hover:text-pink-600 transition">
            <ShoppingCart size={28} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile View */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Cart Icon with Badge */}
          <button onClick={toggleCart} className="relative text-pink-700">
            <ShoppingCart size={26} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Hamburger Menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-pink-700">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-pink-100">
          <Link href="/" className="block text-pink-800 hover:text-pink-600" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" className="block text-pink-800 hover:text-pink-600" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className="block text-pink-800 hover:text-pink-600" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link
            href="/order"
            className="inline-block bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
            onClick={() => setMenuOpen(false)}
          >
            Order Now
          </Link>
        </div>
      )}
    </header>
  );
}

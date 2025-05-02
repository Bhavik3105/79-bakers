import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react'; // 🛒 Import Cart icon

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleCart = () => {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
      cartSidebar.classList.toggle('translate-x-full');
    }
  };

  return (
    <header className="bg-[#ffe4e6] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo & Brand */}
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

        {/* Desktop Nav */}
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

          {/* Cart Button 🛒 */}
          <button
            className="ml-4 text-pink-700 hover:text-pink-600 transition"
            onClick={toggleCart}
          >
            <ShoppingCart size={28} />
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Cart Icon */}
          <button
            className="text-pink-700"
            onClick={toggleCart}
          >
            <ShoppingCart size={26} />
          </button>

          {/* Hamburger Menu */}
          <button
            className="text-pink-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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

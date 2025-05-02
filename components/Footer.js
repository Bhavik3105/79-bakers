// Your existing imports...
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#ffe4e6] text-pink-900 py-10 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Logo + Description */}
        <div className="flex flex-col items-start space-y-3">
          <Image src="/images/cakes/logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
          <h2 className="text-2xl font-bold text-pink-700">79 Baker's</h2>
          <p className="text-sm text-pink-700">Delicious cakes made with love. Order custom cakes for every occasion!</p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-pink-700">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link href="/" className="hover:text-[#fb7185] transition">Home</Link></li>
            {/* <li><Link href="/about" className="hover:text-[#fb7185] transition">About</Link></li>
            <li><Link href="/contact" className="hover:text-[#fb7185] transition">Contact</Link></li>
            <li><Link href="/order" className="hover:text-[#fb7185] transition">Order Now</Link></li> */}
            <li><Link href="/return-policy" className="hover:text-[#fb7185] transition">Return Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-[#fb7185] transition">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-pink-700">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/79bakers/" target="_blank" rel="noopener noreferrer">
              <Instagram className="hover:text-[#fb7185] transition" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="hover:text-[#fb7185] transition" />
            </a>
            <a href="mailto:hello@79bakers.com">
              <Mail className="hover:text-[#fb7185] transition" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-pink-700 mt-8">
        © {new Date().getFullYear()} 79 Baker's. All rights reserved.
      </div>
    </footer>
  );
}

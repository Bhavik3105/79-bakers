// Your existing imports...
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Mail } from 'lucide-react';
import { MessageCircle } from 'lucide-react'; // Using MessageCircle as WhatsApp placeholder

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
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="hover:text-[#25D366] transition"
              >
                <path
                  fill="currentColor"
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.67.15-.197.297-.768.967-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.133-.132.298-.347.446-.52.149-.174.198-.298.298-.497.1-.198.05-.372-.025-.52-.075-.148-.669-1.612-.916-2.204-.242-.58-.487-.5-.67-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.41.248-.69.248-1.282.173-1.41-.074-.128-.272-.198-.57-.347z"
                />
                <path
                  fill="currentColor"
                  d="M12.005 2C6.478 2 2 6.477 2 12.003c0 1.902.496 3.758 1.438 5.392L2 22l4.72-1.376A10.01 10.01 0 0 0 12.005 22c5.526 0 10.003-4.478 10.003-9.997C22.008 6.477 17.53 2 12.005 2zm.003 18.3a8.28 8.28 0 0 1-4.212-1.157l-.302-.18-2.8.814.837-2.73-.196-.314A8.245 8.245 0 0 1 3.7 12.003c0-4.576 3.73-8.304 8.305-8.304 2.22 0 4.3.867 5.872 2.44a8.242 8.242 0 0 1 2.435 5.864c-.002 4.574-3.73 8.297-8.304 8.297z"
                />
              </svg>
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

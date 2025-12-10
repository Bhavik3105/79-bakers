'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Info, 
  Mail, 
  ShoppingCart, 
  Menu, 
  X,
  ChevronDown,
  Cake,
  Cookie,
  Heart,
  User,
  LogOut,
  Package
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { 
    label: 'Home', 
    icon: Home, 
    href: '/' 
  },
  { 
    label: 'About', 
    icon: Info, 
    href: '/about',
    subItems: [
      { label: 'Our Story', href: '/about#story', description: 'Learn about our journey' },
      { label: 'Our Team', href: '/about#team', description: 'Meet the bakers' },
      { label: 'Quality', href: '/about#quality', description: 'Our commitment' }
    ]
  },
  { 
    label: 'Menu', 
    icon: Cake, 
    href: '/#cakes',
    subItems: [
      { label: 'Chocolate Cakes', href: '/#chocolate', description: 'Rich & indulgent' },
      { label: 'Fruit Cakes', href: '/#fruit', description: 'Fresh & fruity' },
      { label: 'Custom Cakes', href: '/#custom', description: 'Made just for you' }
    ]
  },
  { 
    label: 'Contact', 
    icon: Mail, 
    href: '/contact' 
  }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartItems, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Calculate total item count
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Check if current path matches the nav item
  const isActive = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-pink-50/90 backdrop-blur-xl border-b border-pink-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-300 ring-offset-2"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Image
                  src="/images/cakes/logo.png"
                  alt="79 Baker's Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-pink-50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              79 Baker's
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  setHoveredItem(item.label);
                  if (item.subItems) setActiveDropdown(item.label);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setActiveDropdown(null);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors group ${
                      isActive(item.href) 
                        ? 'text-pink-600 font-semibold' 
                        : 'text-pink-800 hover:text-pink-600'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive(item.href) ? 'text-pink-600' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                    {item.subItems && (
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    )}
                    
                    {/* Active indicator */}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-pink-200 to-rose-200 rounded-lg -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Hover indicator */}
                    {hoveredItem === item.label && !isActive(item.href) && (
                      <motion.div
                        layoutId="navHover"
                        className="absolute inset-0 bg-pink-200/50 rounded-lg -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.subItems && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white border border-pink-200 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <motion.div
                            key={subItem.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                          >
                            <Link
                              href={subItem.href}
                              className="block p-3 rounded-lg hover:bg-pink-50 transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-pink-800 group-hover:text-pink-600 transition-colors">
                                    {subItem.label}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {subItem.description}
                                  </div>
                                </div>
                                <Cake className="w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons & Cart */}
          <div className="hidden md:flex items-center space-x-3">
            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <div 
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <motion.button
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-pink-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-semibold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-pink-200 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50">
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        {user?.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-pink-50 transition-colors mb-1"
                          >
                            <Package className="w-4 h-4 text-pink-600" />
                            <span className="text-sm text-gray-700 font-semibold">Admin Panel</span>
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-pink-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-pink-600" />
                          <span className="text-sm text-gray-700">My Profile</span>
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-pink-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-pink-600" />
                          <span className="text-sm text-gray-700">My Orders</span>
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-700">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-pink-700 hover:bg-pink-100">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Cart Button */}
            <motion.button
              onClick={toggleCart}
              className="relative p-2 rounded-lg hover:bg-pink-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-6 h-6 text-pink-700" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            <Link href="/order">
              <Button className="relative overflow-hidden group bg-gradient-to-r from-pink-600 to-rose-600 hover:shadow-lg hover:shadow-pink-300 transition-shadow">
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Order Now</span>
                  <Heart className="w-4 h-4" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Cart */}
            <motion.button
              onClick={toggleCart}
              className="relative p-2 text-pink-700"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </motion.button>

            <motion.button
              className="p-2 rounded-lg hover:bg-pink-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-pink-700" />
              ) : (
                <Menu className="w-6 h-6 text-pink-700" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-pink-200 bg-pink-50/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors group ${
                      isActive(item.href) ? 'bg-pink-200' : 'hover:bg-pink-100'
                    }`}
                    onClick={() => !item.subItems && setMobileMenuOpen(false)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isActive(item.href) 
                        ? 'bg-pink-300' 
                        : 'bg-pink-200 group-hover:bg-pink-300'
                    }`}>
                      <item.icon className={`w-5 h-5 ${
                        isActive(item.href) ? 'text-pink-700' : 'text-pink-700'
                      }`} />
                    </div>
                    <span className={`font-medium flex-1 ${
                      isActive(item.href) ? 'text-pink-700 font-semibold' : 'text-pink-800'
                    }`}>
                      {item.label}
                    </span>
                    {item.subItems && (
                      <ChevronDown className="w-4 h-4 text-pink-600" />
                    )}
                    {isActive(item.href) && (
                      <motion.div
                        className="w-1 h-8 bg-pink-600 rounded-full absolute left-0"
                        layoutId="activeMobileNav"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                  {item.subItems && (
                    <div className="ml-4 mt-2 space-y-2 pl-6 border-l-2 border-pink-300">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block p-2 text-sm text-pink-700 hover:text-pink-600 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <div className="pt-4">
                <Link href="/order" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600">
                    <span className="flex items-center justify-center space-x-2">
                      <span>Order Now</span>
                      <Heart className="w-4 h-4" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </nav>
  );
}

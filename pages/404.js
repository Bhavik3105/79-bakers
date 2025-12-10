import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, CakeSlice } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <motion.div 
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated 404 */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
            404
          </h1>
        </motion.div>

        {/* Animated Cake Icon */}
        <motion.div
          className="flex justify-center mb-6"
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <CakeSlice className="w-24 h-24 text-pink-500" strokeWidth={1.5} />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-pink-900 mb-4">
            Oops! This Cake Doesn't Exist
          </h2>
          <p className="text-lg text-pink-700 mb-8">
            The page you're looking for seems to have been eaten! 🍰
            <br />
            Let's get you back to our delicious collection.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go to Homepage
            </Button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-2 border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="mt-12 grid grid-cols-3 gap-4 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.8 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            >
              <CakeSlice className="w-12 h-12 text-pink-400 mx-auto" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

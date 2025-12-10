import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-pink-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-pink-600 border-t-transparent"></div>
      </motion.div>
      <motion.p
        className="mt-4 text-pink-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading delicious cakes...
      </motion.p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft,
  Check,
  Clock,
  Package,
  Award
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { BackgroundGradient } from '@/components/ui/BackgroundGradient';
import toast from 'react-hot-toast';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
        // Fetch related products
        fetchRelatedProducts(data.product.category);
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await fetch(`/api/products?category=${category}&limit=3`);
      const data = await response.json();
      if (data.success) {
        setRelatedProducts(data.products.filter(p => p._id !== id).slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pink-700 mb-4">Product not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} x ${product.name} to cart! 🎂`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
    toast.success('Proceeding to checkout! 🛒');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this delicious ${product.name} from 79 Baker's!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Mock additional images (using the same image for demo)
  const images = [product.image, product.image, product.image];

  // Mock reviews
  const reviews = [
    { id: 1, author: 'Sarah M.', rating: 5, comment: 'Absolutely delicious! Best cake ever!', date: '2 days ago' },
    { id: 2, author: 'John D.', rating: 5, comment: 'Perfect for my daughter\'s birthday. Everyone loved it!', date: '1 week ago' },
    { id: 3, author: 'Priya S.', rating: 4, comment: 'Great taste, delivery was on time!', date: '2 weeks ago' },
  ];

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-pink-700 hover:text-pink-900 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </motion.div>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BackgroundGradient className="rounded-3xl overflow-hidden mb-4">
              <div className="relative w-full h-[500px] bg-white">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-2xl"
                  priority
                />
                {product.bestseller && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                    🏆 Bestseller
                  </div>
                )}
              </div>
            </BackgroundGradient>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-28 rounded-xl overflow-hidden border-4 transition-all ${
                    selectedImage === index 
                      ? 'border-pink-500 shadow-lg' 
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <div className="inline-block bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-medium">
              {product.category}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-pink-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-pink-700 font-medium">
                {product.rating} ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-pink-600">
                ₹{product.price}
              </span>
              <span className="text-gray-500 line-through text-xl">
                ₹{Math.round(product.price * 1.2)}
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                Save 17%
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed">
              Indulge in our signature {product.name}. Freshly baked with premium ingredients, 
              perfect for celebrations and special moments. Our expert bakers craft each cake 
              with love and attention to detail.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-pink-50 p-4 rounded-xl">
                <Clock className="w-6 h-6 text-pink-600" />
                <div>
                  <div className="font-semibold text-pink-900">Fresh Baked</div>
                  <div className="text-sm text-pink-700">Same day delivery</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-pink-50 p-4 rounded-xl">
                <Package className="w-6 h-6 text-pink-600" />
                <div>
                  <div className="font-semibold text-pink-900">Safe Delivery</div>
                  <div className="text-sm text-pink-700">Secure packaging</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-pink-50 p-4 rounded-xl">
                <Check className="w-6 h-6 text-pink-600" />
                <div>
                  <div className="font-semibold text-pink-900">Quality</div>
                  <div className="text-sm text-pink-700">Premium ingredients</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-pink-50 p-4 rounded-xl">
                <Award className="w-6 h-6 text-pink-600" />
                <div>
                  <div className="font-semibold text-pink-900">Customizable</div>
                  <div className="text-sm text-pink-700">Add your message</div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-10 h-10 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold transition"
                >
                  -
                </button>
                <span className="text-2xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleBuyNow}
                className="flex-1 py-6 text-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 py-6 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleWishlist}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                  isWishlisted
                    ? 'bg-pink-100 border-pink-500 text-pink-700'
                    : 'border-gray-300 text-gray-700 hover:border-pink-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-pink-500' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-pink-300 transition-all"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-pink-900 mb-8">
            Customer Reviews
          </h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-pink-900">{review.author}</div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-pink-900 mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((cake) => (
                <Link key={cake._id} href={`/product/${cake._id}`}>
                  <BackgroundGradient className="rounded-3xl bg-white overflow-hidden cursor-pointer h-full hover:shadow-xl transition-shadow">
                    <div className="relative h-64">
                      <Image
                        src={cake.image}
                        alt={cake.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-pink-900 mb-2">
                        {cake.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-pink-600">
                          ₹{cake.price}
                        </span>
                      </div>
                    </div>
                  </BackgroundGradient>
                </Link>
              ))}
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
}

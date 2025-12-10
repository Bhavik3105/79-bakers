import dynamic from 'next/dynamic';
import Slideshow from '@/components/Slideshow';

// Lazy load components that are below the fold
const CakeGallery = dynamic(() => import('@/components/CakeGallery'), {
  loading: () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
    </div>
  ),
  ssr: true
});

const BestSeller = dynamic(() => import('@/components/BestSeller'), {
  loading: () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
    </div>
  ),
  ssr: true
});

const PromoBanner = dynamic(() => import('@/components/PromoBanner'), {
  loading: () => (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
    </div>
  ),
  ssr: true
});

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Banner Slideshow - Full Width, No Filters */}
      <Slideshow />
      
      {/* Our Cakes Section with Filters */}
      <section className="py-12">
        <div className="text-center mb-8 px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-pink-800 mb-3">Our Delicious Cakes</h2>
          <p className="text-lg text-gray-600">Browse our collection of freshly baked cakes</p>
        </div>
        <CakeGallery />
      </section>

      {/* Best Sellers Section */}
      <BestSeller />
      
      {/* Promo Banner */}
      <div className="px-6">
        <PromoBanner />
      </div>
    </main>
  );
}

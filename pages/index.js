import CakeGallery from '@/components/CakeGallery';
import Slideshow from '@/components/Slideshow';
import PromoBanner from '@/components/PromoBanner';
import BestSeller from '@/components/BestSeller';

export default function Home() {
  return (
    <main className="min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to 79 Baker's</h1>
      <Slideshow />
      <CakeGallery />
      <BestSeller />
      <PromoBanner />
    </main>
  );
}

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        image: '/images/cakes/chocolate-truffle.jpg',
        title: 'Delicious Chocolate Cakes',
        subtitle: 'Freshly Baked Every Day'
    },
    {
        image: '/images/cakes/red-velvet.jpg',
        title: 'Red Velvet Heaven',
        subtitle: 'Perfect for Every Celebration'
    },
    {
        image: '/images/cakes/butterscotch.jpg',
        title: 'Butterscotch Delight',
        subtitle: 'Made with Love & Care'
    },
];

export default function Slideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section
            className="relative w-full h-screen overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Gradient Overlay for Better Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
            
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={slides[currentIndex].image}
                    alt={slides[currentIndex].title}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className="transition-all duration-700 ease-in-out"
                    priority={currentIndex === 0}
                    quality={90}
                    sizes="100vw"
                />
            </div>

            {/* Hero Text Content */}
            <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 w-full">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 md:mb-6 drop-shadow-2xl leading-tight">
                            {slides[currentIndex].title}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-6 md:mb-10 drop-shadow-lg">
                            {slides[currentIndex].subtitle}
                        </p>
                        <button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300">
                            Order Now
                        </button>
                    </div>
                </div>
            </div>


            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 bg-white/90 text-pink-700 p-3 md:p-4 rounded-full z-30 hover:bg-white hover:scale-110 transition-all duration-200 shadow-xl"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 bg-white/90 text-pink-700 p-3 md:p-4 rounded-full z-30 hover:bg-white hover:scale-110 transition-all duration-200 shadow-xl"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-10 md:bottom-12 w-full flex justify-center gap-3 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2.5 md:h-3 rounded-full transition-all duration-300 ${
                            index === currentIndex 
                                ? 'bg-pink-500 w-8 md:w-10 shadow-lg' 
                                : 'w-2.5 md:w-3 bg-white/60 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

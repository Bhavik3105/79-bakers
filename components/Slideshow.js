import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
    '/images/cakes/dark-chocolate.jpeg',
    '/images/cakes/dutch-truffle.jpeg',
    '/images/cakes/message-cake.jpeg',
    '/images/cakes/theme-cake.jpeg',
];

export default function Slideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div
            className="relative w-full max-w-6xl mx-auto h-[30rem] md:h-[26rem] sm:h-[20rem] rounded-xl overflow-hidden shadow-md mb-10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <Image
                src={images[currentIndex]}
                alt={`Cake ${currentIndex + 1}`}
                layout="fill"
                objectFit="contain"
                className="transition-all duration-500 bg-white"
                priority
            />


            {/* Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full z-10 hover:bg-black/50"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full z-10 hover:bg-black/50"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 w-full flex justify-center gap-2 z-10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-3 w-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

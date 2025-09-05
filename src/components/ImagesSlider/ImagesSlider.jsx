import { useEffect, useRef, useState } from "react";
import "./ImagesSlider.css";

export function ImagesSlider() {
    const images = [
        "/img-slider-1.png",
        "/img-slider-2.png",
        "/img-slider-3.png",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const startAutoPlay = () => {
        if (intervalRef.current) return; // evitar duplicados
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);
    };

    const stopAutoPlay = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleTouchStart = (e) => {
        stopAutoPlay(); // detener autoplay mientras toco
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // swipe izquierda → siguiente
                setCurrentIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                );
            } else {
                // swipe derecha → anterior
                setCurrentIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                );
            }
        }

        startAutoPlay(); // reanudar autoplay cuando suelta
    };

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, []);

    return (
        <div
            className="slider"
            onMouseEnter={stopAutoPlay}   // 👈 pausa cuando pongo el mouse encima
            onMouseLeave={startAutoPlay} // 👈 reanuda al salir
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="slider-inner"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        onClick={() => setCurrentIndex(i)}
                        className={`slider-inner-img ${i === currentIndex ? "active" : ""}`}
                        alt="bazarshop mayorista y minorista - bazar - jugueteria - regaleria - libreria"
                    />
                ))}
            </div>
            <div className="slider-dots">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`dot ${i === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(i)}
                    ></span>
                ))}
            </div>
        </div>
    );
}

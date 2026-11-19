"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const defaultPortfolioImages = [
  { src: "/preview/car-hero.png", alt: "Automotive showcase front view" },
  { src: "/preview/car-rear.png", alt: "Automotive showcase rear view" },
  { src: "/preview/car-side.png", alt: "Automotive showcase side view" },
  { src: "/preview/car-hero.png", alt: "Automotive campaign 1" },
  { src: "/preview/car-rear.png", alt: "Automotive campaign 2" },
  { src: "/preview/car-side.png", alt: "Automotive campaign 3" },
  { src: "/preview/car-hero.png", alt: "Automotive campaign 4" },
  { src: "/preview/car-rear.png", alt: "Automotive campaign 5" },
  { src: "/preview/car-side.png", alt: "Automotive campaign 6" },
];

export default function Portfolio({ data }: { data?: any }) {
  const displayImages = data?.images || defaultPortfolioImages;

  const scrollRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastLightboxIndexRef = useRef<number | null>(null);
  const lightboxSlidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const totalDots = Math.ceil(displayImages.length / 2);
  const [isLastPage, setIsLastPage] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -600 : 600;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const progress = scrollLeft / maxScroll;
    const page = Math.round(progress * (totalDots - 1));
    setCurrentPage(Math.min(page, totalDots - 1));
    setIsLastPage(scrollLeft >= maxScroll - 10);
  };

  const scrollLightboxTo = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const slide = lightboxSlidesRef.current[index];
    if (!slide) return;
    slide.scrollIntoView({ behavior, block: "nearest", inline: "start" });
  }, []);

  const getLightboxIndex = useCallback(() => {
    if (!lightboxRef.current || lightboxRef.current.clientWidth === 0) return 0;
    return Math.round(lightboxRef.current.scrollLeft / lightboxRef.current.clientWidth);
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCardPointerDown = (event: React.PointerEvent) => {
    dragStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleCardPointerUp = (index: number, event: React.PointerEvent) => {
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (!start) {
      openLightbox(index);
      return;
    }
    const deltaX = Math.abs(event.clientX - start.x);
    const deltaY = Math.abs(event.clientY - start.y);
    if (deltaX < 8 && deltaY < 8) {
      openLightbox(index);
    }
  };

  const handleCardPointerCancel = () => {
    dragStartRef.current = null;
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goPrev = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      return Math.max(current - 1, 0);
    });
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      return Math.min(current + 1, displayImages.length - 1);
    });
  }, []);

  const handleLightboxScroll = () => {
    if (!lightboxRef.current) return;
    const { scrollLeft, clientWidth } = lightboxRef.current;
    if (clientWidth === 0) return;
    const nextIndex = Math.round(scrollLeft / clientWidth);
    setLightboxIndex((current) => {
      if (current === null) return current;
      return Math.min(Math.max(nextIndex, 0), displayImages.length - 1);
    });
  };

  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = "";
      lastLightboxIndexRef.current = null;
      return;
    }
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => {
      const behavior = lastLightboxIndexRef.current === null ? "auto" : "smooth";
      scrollLightboxTo(lightboxIndex, behavior);
      lastLightboxIndexRef.current = lightboxIndex;
    });
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, scrollLightboxTo]);

  return (
    <>
      <section id="portfolio" className="py-8 md:py-12 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-text-main mb-10 tracking-tight uppercase"
          >
            Our Proud Creations
          </motion.h2>
        </div>

        {/* Image Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: "max(1.5rem, calc((100vw - 1400px) / 2 + 2.5rem))",
            paddingRight: "1.5rem",
          }}
        >
          {displayImages.map((img: any, i: number) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => openLightbox(i)}
              onPointerDown={handleCardPointerDown}
              onPointerUp={(event) => handleCardPointerUp(i, event)}
              onPointerCancel={handleCardPointerCancel}
              onPointerLeave={handleCardPointerCancel}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openLightbox(i);
                }
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-[40vw] aspect-[16/10] relative rounded-2xl overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`Open ${img.alt}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8ddd4] to-[#d4c4b8] dark:from-[#2a2520] dark:to-[#1e1a16]" />
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 55vw, 40vw"
                style={{ pointerEvents: "none" }}
              />
            </motion.button>
          ))}
        </div>

        {/* Pagination + OUR WORKS button */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-card-border flex items-center justify-center hover:bg-card transition-colors text-text-muted hover:text-text-main"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalDots }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentPage ? "bg-text-main scale-110" : "bg-card-border"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-card-border flex items-center justify-center hover:bg-card transition-colors text-text-muted hover:text-text-main"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>

            {/* OUR WORKS button appears on last page */}
            <motion.a
              href="https://www.behance.net/jasminekrdd"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isLastPage ? 1 : 0, x: isLastPage ? 0 : -10 }}
              transition={{ duration: 0.3 }}
              className={`ml-4 px-6 py-2.5 rounded-full border border-card-border text-lg font-normal text-text-main hover:bg-card transition-colors tracking-widest ${
                isLastPage ? "pointer-events-auto" : "pointer-events-none"
              }`}
            >
              OUR WORKS
            </motion.a>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center"
            aria-label="Close fullscreen gallery"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          <div
            ref={lightboxRef}
            onClick={(e) => e.stopPropagation()}
            onScroll={handleLightboxScroll}
            className="h-screen w-screen overflow-x-auto flex snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
            }}
          >
            {displayImages.map((img: any, i: number) => (
              <div
                key={i}
                ref={(el) => {
                  lightboxSlidesRef.current[i] = el;
                }}
                className="relative h-screen w-screen min-w-full shrink-0 snap-center"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === lightboxIndex}
                  className="object-contain select-none"
                  sizes="100vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

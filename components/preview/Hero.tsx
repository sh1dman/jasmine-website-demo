"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface HeroSlide {
  src: string;
  tabletSrc?: string;
  mobileSrc?: string;
  alt?: string;
}

const defaultSlides: HeroSlide[] = [
  { src: "/heroPagePicture.jpg", alt: "Hero slide 1" },
];

export default function Hero({ data }: { data?: any }) {
  const slides: HeroSlide[] =
    data?.slides?.filter((s: any) => s.src || s.tabletSrc || s.mobileSrc).length > 0
      ? data.slides.filter((s: any) => s.src || s.tabletSrc || s.mobileSrc)
      : defaultSlides;

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, slides.length, goTo]);

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, slides.length, goTo]);

  // Auto-advance every 5 seconds (only when multiple slides exist)
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  const activeSlide = slides[current] || defaultSlides[0];

  const mobileImg = activeSlide.mobileSrc || activeSlide.tabletSrc || activeSlide.src;
  const tabletImg = activeSlide.tabletSrc || activeSlide.src;
  const desktopImg = activeSlide.src || activeSlide.tabletSrc || activeSlide.mobileSrc;

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-background">
      <div className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col">

        {/* Slideshow backgrounds - responsive image rendering with instant CSS breakpoint switching */}
        <AnimatePresence mode="sync" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Mobile Image (< 768px) */}
            <img
              src={mobileImg}
              alt={activeSlide.alt || "Hero background mobile"}
              className="w-full h-full object-cover object-center block md:hidden"
            />

            {/* Tablet / iPad Image (768px - 1023px) */}
            <img
              src={tabletImg}
              alt={activeSlide.alt || "Hero background tablet"}
              className="w-full h-full object-cover object-center hidden md:block lg:hidden"
            />

            {/* Desktop Image (>= 1024px) */}
            <img
              src={desktopImg}
              alt={activeSlide.alt || "Hero background desktop"}
              className="w-full h-full object-cover object-center hidden lg:block"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/15 dark:bg-black/30 z-10" />

        {/* Prev / Next arrows — only shown when multiple slides */}
        {slides.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous slide"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-[#E33A38] border border-white/20 hover:border-[#E33A38] flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={goNext}
              aria-label="Next slide"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-[#E33A38] border border-white/20 hover:border-[#E33A38] flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Content layer */}
        <div className="relative z-20 w-full pt-28 md:pt-40">
          <div className="flex items-stretch">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-5 md:w-10 lg:w-14 xl:w-[70px] bg-[#E33A38] origin-left"
            />
            <div className="flex flex-col pl-4 md:pl-6 py-2 justify-center">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="font-serif text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] leading-[0.9] tracking-normal text-[#E33A38] uppercase"
                style={{ textShadow: "0px 4px 20px rgba(0,0,0,0.1)" }}
              >
                YOUR VISION
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="font-serif text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[0.9] tracking-normal text-white uppercase"
                style={{ textShadow: "0px 4px 20px rgba(0,0,0,0.1)" }}
              >
                OUR MISSION
              </motion.h1>
            </div>
          </div>
        </div>

        {/* Bottom bar — tagline + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-8 md:pb-12 mt-auto pt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <p className="text-sm md:text-base text-white/90 max-w-xl leading-relaxed">
            Whether you are a <strong className="font-bold text-white">global leader</strong> or a rising brand, we treat your reputation with the same integrity and passion as if it were our own.
          </p>
          <a
            href="#contact"
            className="shrink-0 px-6 py-2 md:px-8 md:py-2.5 rounded-full border border-white text-white text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300 bg-transparent"
          >
            GET IN TOUCH
          </a>
        </motion.div>

        {/* Dot indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2 bg-[#E33A38]"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

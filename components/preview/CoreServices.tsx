"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

const defaultServices = [
  {
    category: "PRODUCTION",
    title: "AUTOMOTIVE VISUAL\nPRODUCTION",
    image: "/preview/car-hero.png",
    description: "We capture vehicles through cinematic videography and high-end photography, showcasing design, motion, and performance with precision and luxury detail.",
  },
  {
    category: "DIGITAL",
    title: "SOCIAL MEDIA MANAGEMENT\n& ADVERTISING",
    image: "/preview/car-rear.png",
    description: "We manage digital presence through consistent content creation, professional copywriting, and targeted advertising campaigns that attract real automotive clients.",
  },
  {
    category: "BRANDING",
    title: "STRATEGIC BRANDING\n& GRAPHIC DESIGN",
    image: "/preview/car-side.png",
    description: "We build strong brand identities and create refined visual materials, including brochures, catalogues, posters, and premium automotive assets.",
  },
  {
    category: "EVENTS",
    title: "EVENT MANAGEMENT\n& SPECIAL EVENTS",
    image: "/preview/car-hero.png",
    description: "We transform automotive launches and experiences into premium events, handling showroom openings, VIP test drives, and full creative coverage.",
  },
  {
    category: "TECHNOLOGY",
    title: "PROFESSIONAL TECHNOLOGY\nSOLUTIONS",
    image: "/preview/car-rear.png",
    description: "We provide digital and technical solutions that support modern automotive businesses and enhance workflow, presentation, and customer experience.",
  },
  {
    category: "INCUBATOR",
    title: "CREATIVE\nINCUBATOR",
    image: "/preview/car-side.png",
    description: "We develop and mentor emerging creative talent through hands-on training in multimedia production, helping elevate industry standards in the region.",
  },
];

export default function CoreServices({ data }: { data?: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const displayServices = data?.services || defaultServices;
  const title = data?.title || "OUR CORE SERVICES";
  
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = displayServices.length;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.children[0]?.clientWidth || 350;
    const gap = 24;
    const scrollAmount = direction === "left" ? -(cardWidth + gap) : (cardWidth + gap);
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const page = Math.round((scrollLeft / maxScroll) * (totalPages - 1));
    setCurrentPage(Math.min(page, totalPages - 1));
  };

  return (
    <section id="services" className="py-8 md:py-12 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-text-main mb-10 tracking-tight"
        >
          {title}
        </motion.h2>
      </div>

      {/* Scrollable Cards */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto px-6 md:px-10 pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            paddingLeft: "max(1.5rem, calc((100vw - 1400px) / 2 + 2.5rem))",
          }}
        >
          {displayServices.map((service: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="shrink-0 w-[320px] md:w-[380px] lg:w-[440px] bg-card rounded-2xl border border-card-border overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer"
            >
              <div className="p-6 pb-4">
                <span className="text-primary text-xs md:text-sm font-bold tracking-widest uppercase">
                  {service.category}
                </span>
                <h3 className="font-bold text-text-main text-lg md:text-xl mt-2 leading-tight whitespace-pre-line">
                  {service.title}
                </h3>
              </div>
              <div className="relative h-[260px] md:h-[300px] mx-4 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-[#e8ddd4] to-[#d4c4b8] dark:from-[#2a2520] dark:to-[#1e1a16]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 group-hover:blur-sm transition-all duration-700"
                  sizes="(min-width: 1024px) 440px, (min-width: 768px) 380px, 320px"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6 text-center">
                  <p className="text-white text-lg md:text-xl lg:text-2xl leading-tight opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pagination */}
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
          {Array.from({ length: totalPages }).map((_, i) => (
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
      </div>
    </section>
  );
}

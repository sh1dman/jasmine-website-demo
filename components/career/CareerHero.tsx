"use client";

import { motion } from "framer-motion";
import type { CareerContent } from "@/types/career";
import { defaultCareerContent } from "@/types/career";

/**
 * Compact page header — deliberately small so the open positions sit near the
 * top of the page and applicants can go straight to applying.
 */
export default function CareerHero({ data }: { data?: CareerContent }) {
  const eyebrow = data?.eyebrow || defaultCareerContent.eyebrow;
  const title = data?.title || defaultCareerContent.title;

  return (
    <section id="career-hero" className="relative bg-background pt-28 md:pt-36 pb-2">
      <div className="flex items-stretch">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-3 md:w-5 lg:w-6 bg-primary origin-top"
        />
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col pl-4 md:pl-6 justify-center"
        >
          <span className="text-primary font-normal text-xs md:text-sm tracking-widest uppercase">
            {eyebrow}
          </span>
          <h1 className="font-serif text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] leading-[1] tracking-normal text-text-main uppercase">
            {title}
          </h1>
        </motion.div>
      </div>
    </section>
  );
}

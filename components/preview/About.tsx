"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const stats = [
  { title: "AUTOMOTIVE", subtitle: "CAR SPECIALISTS" },
  { title: "CINEMATIC", subtitle: "VISUAL PRODUCTION" },
  { title: "STRATEGIC", subtitle: "DATA-DRIVEN RESULTS" },
];

export default function About({ data }: { data?: any }) {
  const text = data?.text || "Jasmine is a creative automotive agency specializing in cinematic visuals, refined branding, and luxury storytelling. We help automotive brands elevate their presence through high-end production, strategic creativity, and emotionally driven content crafted for the modern digital landscape.";
  const image = data?.image || "/preview/car-rear.png";

  return (
    <section id="about" className="py-8 md:py-12 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-card rounded-3xl border border-card-border overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left — Text Content */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-primary font-normal text-base md:text-lg tracking-widest uppercase mb-2"
              >
                WE ARE
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-text-main mb-8 tracking-tight"
              >
                JASMINE.KRD
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-text-main text-lg md:text-xl lg:text-2xl leading-normal text-left mb-10 max-w-[520px]"
              >
                {text}
              </motion.p>

              {/* Divider */}
              <div className="w-full max-w-[520px] h-px bg-card-border mb-6" />

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-row justify-between w-full max-w-[520px]"
              >
                {stats.map((stat) => (
                  <div key={stat.title} className="flex flex-col">
                    <p className="text-xs md:text-sm font-bold text-text-main tracking-widest uppercase">{stat.title}</p>
                    <p className="text-[10px] md:text-xs text-text-main tracking-widest uppercase mt-0.5">{stat.subtitle}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Car Image */}
            <div className="relative min-h-[300px] md:min-h-[400px] lg:min-h-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8ddd4] to-[#d4c4b8] dark:from-[#2a2520] dark:to-[#1e1a16]" />
              <Image
                src={image}
                alt="Luxury automotive rear view"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

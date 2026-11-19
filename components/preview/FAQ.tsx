"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const defaultFaqItems = [
  {
    question: "What makes Jasmine different from other marketing agencies?",
    answer:
      "Unlike general marketing agencies, Jasmine is built specifically for the high-end automotive sector. We combine cinematic visual storytelling with a structured, business-driven approach. Our focus is not just aesthetics, but creating digital systems that drive real sales and move inventory.",
  },
  {
    question: "Can you handle marketing for events outside of the monthly packages?",
    answer:
      "Yes. We offer flexible event coverage that can be added to any existing plan. Whether it’s a product launch, auto show, or grand opening, we deliver premium cinematic content tailored specifically to each event.",
  },
  {
    question: "Does Jasmine have specific packages, or do you work per project?",
    answer:
      "We offer both structured monthly partnerships and per-project solutions. Our packages are designed to scale with your business, from emerging dealerships to enterprise-level automotive brands.",
  },
  {
    question: "Where can Jasmine work?",
    answer:
      "Jasmine operates globally, with a strong focus on the Kurdistan Region of Iraq and the wider Middle East. We are also able to travel for productions and manage remote campaigns worldwide.",
  },
  {
    question: "Why does Jasmine work only for automobile-related brands?",
    answer:
      "Specialization is our strength. By focusing exclusively on the automotive industry, we develop deeper expertise, more efficient workflows, and stronger market understanding than general agencies. This allows us to deliver more precise and measurable results.",
  },
];

export default function FAQ({ data }: { data?: any }) {
  const displayFaqs = data?.questions || defaultFaqItems;
  const [openIndex, setOpenIndex] = useState<number>(-1);

  return (
    <section id="faq" className="py-8 md:py-12 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-sans font-normal text-2xl md:text-3xl lg:text-4xl text-text-main mb-10 tracking-tight"
        >
          Frequently Asked Questions (FAQ)
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-card-border bg-card overflow-hidden"
        >
          {displayFaqs.map((item: any, i: number) => (
            <div
              key={i}
              onMouseEnter={() => setOpenIndex(i)}
              onMouseLeave={() => setOpenIndex(-1)}
              className={`${i < displayFaqs.length - 1 ? "border-b border-card-border" : ""}`}
            >
              <button
                onClick={() => setOpenIndex(i)}
                className="w-full flex items-start gap-4 p-6 md:p-8 text-left hover:bg-background/50 transition-colors group cursor-pointer"
              >
                {/* Red dot */}
                <span className="mt-2 shrink-0 w-3 h-3 rounded-full bg-primary" />
                <span className="font-bold text-text-main text-xl md:text-2xl flex-1 group-hover:text-primary transition-colors">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 mt-1 text-text-muted"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 pl-[3.25rem] md:pl-[4.25rem]">
                      <div className="flex items-start gap-3">
                        <p className="text-text-muted text-lg md:text-xl lg:text-2xl leading-normal text-justify">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

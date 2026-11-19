"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { JobOpening } from "@/types/career";

function Meta({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full border border-card-border bg-background text-xs md:text-sm font-medium text-text-muted tracking-wide">
      {label}
    </span>
  );
}

export default function JobOpenings({
  jobs,
  onApply,
}: {
  jobs: JobOpening[];
  onApply: (job: JobOpening | null) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="openings" className="py-8 md:py-12 bg-background scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-end justify-between gap-4 mb-10"
        >
          <h2 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-text-main tracking-tight">
            OPEN POSITIONS
          </h2>
          <p className="text-text-muted text-base md:text-lg">
            {jobs.length > 0
              ? `${jobs.length} ${jobs.length === 1 ? "opportunity" : "opportunities"} available`
              : "No listed openings right now"}
          </p>
        </motion.div>

        {jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-card-border bg-card p-8 md:p-12 text-center"
          >
            <span className="block w-12 h-1 bg-primary rounded-full mx-auto mb-6" />
            <h3 className="font-bold text-text-main text-xl md:text-2xl mb-3">
              We are not hiring for a specific role at the moment
            </h3>
            <p className="text-text-muted text-base md:text-lg max-w-[620px] mx-auto mb-8">
              We still want to hear from talented people. Send us an open
              application and we will reach out the moment something that fits
              your profile opens up.
            </p>
            <button
              type="button"
              onClick={() => onApply(null)}
              className="px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm md:text-base tracking-widest uppercase hover:bg-primary-hover transition-colors"
            >
              SEND AN OPEN APPLICATION
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, i) => {
              const isOpen = openId === job.id;
              const closed = job.status === "closed";

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
                  className={`rounded-2xl border bg-card overflow-hidden transition-colors ${
                    isOpen ? "border-primary/50" : "border-card-border"
                  }`}
                >
                  <div className="group flex flex-col md:flex-row md:items-center gap-4 p-6 md:p-8 hover:bg-background/50 transition-colors">
                    {/* Title + meta double as the expand/collapse control */}
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : job.id)}
                      aria-expanded={isOpen}
                      aria-controls={`job-details-${job.id}`}
                      className="flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="shrink-0 w-3 h-3 rounded-full bg-primary" />
                        <h3 className="font-bold text-text-main text-xl md:text-2xl group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        {closed && (
                          <span className="px-2.5 py-0.5 rounded-full bg-text-muted/15 text-text-muted text-xs font-bold tracking-widest uppercase">
                            CLOSED
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4 md:pl-6">
                        {job.type && <Meta label={job.type} />}
                        {job.workMode && <Meta label={job.workMode} />}
                        {job.location && <Meta label={job.location} />}
                      </div>
                    </button>

                    <div className="flex items-center gap-3 shrink-0 md:pl-6">
                      {!closed && (
                        <button
                          type="button"
                          onClick={() => onApply(job)}
                          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-primary-hover transition-colors"
                        >
                          APPLY
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : job.id)}
                        aria-label={isOpen ? "Hide details" : "Show details"}
                        aria-expanded={isOpen}
                        className="p-1 text-text-muted hover:text-primary transition-colors"
                      >
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="block"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </motion.span>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        id={`job-details-${job.id}`}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-8 md:pl-[3.5rem] space-y-8">
                          <div className="h-px w-full bg-card-border" />

                          {job.summary && (
                            <p className="text-text-muted text-base md:text-lg lg:text-xl leading-relaxed whitespace-pre-line">
                              {job.summary}
                            </p>
                          )}

                          {job.deadline && (
                            <div>
                              <p className="text-xs font-bold text-text-main tracking-widest uppercase">
                                APPLY BEFORE
                              </p>
                              <p className="text-text-muted text-base mt-1">
                                {job.deadline}
                              </p>
                            </div>
                          )}

                          {!closed && (
                            <button
                              type="button"
                              onClick={() => onApply(job)}
                              className="px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm tracking-widest uppercase hover:bg-primary-hover transition-colors"
                            >
                              APPLY FOR THIS ROLE
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

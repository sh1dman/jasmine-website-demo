"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    position: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", organization: "", position: "", email: "", subject: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full px-5 py-4 rounded-xl border border-card-border bg-card text-text-main text-base md:text-lg placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all font-sans";

  return (
    <section id="contact" className="py-8 md:py-12 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-sans font-normal text-3xl md:text-4xl lg:text-5xl text-text-main mb-10 tracking-tight"
        >
          ASK A QUESTION
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Row 1: Name + Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-text-main tracking-widest uppercase mb-2">
                NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name ..."
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-base font-bold text-text-main tracking-widest uppercase mb-2">
                ORGANIZATION
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Your Company ..."
                className={inputClasses}
              />
            </div>
          </div>

          {/* Row 2: Position + E-Mail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-text-main tracking-widest uppercase mb-2">
                POSITION
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Your Current Position..."
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-base font-bold text-text-main tracking-widest uppercase mb-2">
                E-MAIL
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Row 3: Subject + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-text-main tracking-widest uppercase mb-2">
                SUBJECT
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Your Current Position..."
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-base font-bold text-text-main tracking-widest uppercase mb-2">
                PHONE
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+123 123 456 789"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Row 4: Message */}
          <div>
            <label className="block text-base font-bold text-text-main tracking-widest uppercase mb-2">
              MESSAGE
            </label>
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what you want to tell us..."
              className={inputClasses}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-10 py-4 rounded-xl bg-primary text-white font-bold text-lg tracking-widest uppercase hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading"
                ? "SENDING..."
                : status === "success"
                ? "SENT ✓"
                : "SEND MESSAGE"}
            </button>
          </div>

          {status === "success" && (
            <p className="text-lg text-green-600 font-normal tracking-wide">Thank you! We&apos;ll get back to you soon.</p>
          )}
          {status === "error" && (
            <p className="text-lg text-primary font-normal tracking-wide">Something went wrong. Please try again.</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import JasmineLogo from "@/components/ui/JasmineLogo";
import ThemeToggle from "@/components/ui/ThemeToggle";

// Absolute hrefs so the section links also work from sub-pages like /career.
const navLinks = [
  { label: "Home", href: "/#hero" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Careers", href: "/career" },
];

export default function PreviewNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 left-0 right-0 z-50 w-full pt-4"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative h-10 md:h-12 w-auto shrink-0 flex items-center">
          <JasmineLogo className="h-full w-auto" />
        </Link>

        {/* Center Nav — Pill Shape */}
        <nav className="hidden md:flex items-center gap-1 border border-card-border rounded-full px-2 py-1.5 bg-card/80 backdrop-blur-sm">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-5 py-1.5 text-sm font-medium transition-colors rounded-full hover:bg-primary/5 hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-text-main"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — Language Selector, Theme Toggle & Hamburger */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-card-border bg-card/80 hover:bg-card transition-colors text-sm font-medium text-text-main">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
              <path d="M2 12h20"/>
            </svg>
            En
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center justify-center p-2 rounded-full border border-card-border bg-card/80 hover:bg-card transition-colors text-text-main"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-[calc(100%-1rem)] left-0 right-0 mx-6 p-4 rounded-2xl border border-card-border bg-card/95 backdrop-blur-md shadow-lg flex flex-col gap-4"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-primary/5 hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-text-main"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="h-[1px] w-full bg-card-border" />
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium text-text-main">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
              English
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

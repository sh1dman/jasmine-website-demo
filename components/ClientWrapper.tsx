"use client";

import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";

const PreviewNavbar = dynamic(() => import("@/components/preview/PreviewNavbar"), {
  ssr: true,
});

interface ClientWrapperProps {
  children: ReactNode;
}

import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative w-full min-h-screen text-foreground bg-background">
        <div className="relative z-10">
          {!isAdmin && <PreviewNavbar />}
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}

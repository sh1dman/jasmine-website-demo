import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const siteUrl = "https://jasmine.krd";
const siteName = "Jasmine Agency";
const siteTitle = "Jasmine Agency | Your Vision, Our Mission";
const siteDescription =
  "Jasmine is a creative agency built for the high-end automotive sector. We combine cinematic visual storytelling with data-driven strategy.";

export const metadata: Metadata = {
  // Required so share previews get absolute image URLs — WhatsApp, Facebook
  // and X all reject relative ones.
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="/" />
        <link rel="dns-prefetch" href="/" />
      </head>
      <body className="antialiased">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "AQUATIC — Into the Deep | Cinematic Underwater Experience",
  description: "A luxury, cinematic underwater landing page featuring live underwater performance footage.",
  openGraph: {
    title: "AQUATIC — Into the Deep | Cinematic Underwater Experience",
    description: "A luxury, cinematic underwater landing page featuring live underwater performance footage.",
    url: "https://aquatic-cinematic.vercel.app",
    siteName: "AQUATIC",
    images: [
      {
        url: "/videos/underwater-poster.jpg",
        width: 1200,
        height: 630,
        alt: "AQUATIC Cinematic Underwater Experience Preview",
      },
      {
        url: "/images/editorial-mermaid.png",
        width: 800,
        height: 1000,
        alt: "AQUATIC Editorial Mermaid Artwork",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AQUATIC — Into the Deep | Cinematic Underwater Experience",
    description: "A luxury, cinematic underwater landing page featuring live underwater performance footage.",
    images: ["/videos/underwater-poster.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="shortcut icon" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="antialiased bg-[#02070B] text-[#F5F7F8] selection:bg-[#D94B73] selection:text-white">
        {children}
      </body>
    </html>
  );
}

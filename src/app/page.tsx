"use client";

import { useState, useEffect } from "react";
import { useLenis } from "@/hooks/useLenis";
import { Navbar } from "@/components/navigation/Navbar";
import { CinematicExperience } from "@/components/cinematic/CinematicExperience";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Smooth Lenis Scroll setup
  useLenis();

  useEffect(() => {
    // AQUARA initial wordmark reveal loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#02070B] text-[#F5F7F8] selection:bg-[#D94B73] selection:text-white overflow-x-hidden">
      {/* Loading Screen */}
      <div
        className={`fixed inset-0 z-50 bg-[#02070B] flex items-center justify-center transition-opacity duration-1000 pointer-events-none ${
          loading ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <span className="font-serif text-3xl md:text-5xl tracking-[0.4em] uppercase text-[#F5F7F8] animate-pulse">
            AQUARA
          </span>
          <span className="text-[10px] tracking-[0.3em] font-mono text-[#36C7E8] uppercase">
            DESCENDING...
          </span>
        </div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Pinned Cinematic Scroll Experience */}
      <CinematicExperience />
    </main>
  );
}

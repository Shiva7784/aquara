"use client";

import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";

interface FinalChapterProps {
  opacity: number;
}

export function FinalChapter({ opacity }: FinalChapterProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-between items-center text-center px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-16 transition-opacity duration-300 pointer-events-none"
      style={{ opacity }}
    >
      <div className="pt-8 sm:pt-10 md:pt-8">
        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#36C7E8] font-mono">
          06 — THE SURFACE
        </span>
      </div>

      {/* Main Conclusion Typography */}
      <div className="max-w-4xl my-auto space-y-3 sm:space-y-4 pointer-events-auto px-2">
        <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extralight tracking-[0.04em] sm:tracking-[0.06em] text-[#F5F7F8] uppercase leading-[0.95]">
          <span className="block">THE SURFACE</span>
          <span className="block italic text-[#36C7E8]">IS ONLY THE</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F5F7F8] via-[#36C7E8] to-[#D94B73]">
            BEGINNING.
          </span>
        </h2>

        <div className="pt-4 sm:pt-6 md:pt-10 flex justify-center">
          <MagneticButton className="!px-6 sm:!px-8 md:!px-10 !py-3.5 sm:!py-4 md:!py-5 text-[10px] sm:text-[11px] md:text-xs tracking-[0.25em] sm:tracking-[0.3em]">
            EXPLORE THE WORLD
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D94B73] group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </div>
      </div>

      {/* Footer Minimal Branding */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-4 text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] text-[#F5F7F8]/40 font-mono uppercase border-t border-white/5 pt-3 sm:pt-4 md:pt-6 max-w-6xl">
        <span>© 2026 AQUARA CINEMATIC</span>
        <span>A24 VISUAL ATMOSPHERE</span>
        <span>ALL RIGHTS RESERVED</span>
      </div>
    </div>
  );
}

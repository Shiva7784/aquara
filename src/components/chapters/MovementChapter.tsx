"use client";

import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface MovementChapterProps {
  opacity: number;
}

export function MovementChapter({ opacity }: MovementChapterProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col sm:flex-row items-center justify-center sm:justify-between px-4 sm:px-8 md:px-16 lg:px-24 pointer-events-none transition-opacity duration-300 gap-6"
      style={{ opacity }}
    >
      {/* Left: Sleek Editorial Artwork Badge (Visible on lg+ screens) */}
      <div className="hidden lg:flex items-center gap-4 ml-16 xl:ml-32 pointer-events-auto transform -translate-y-4 hover:scale-105 transition-transform duration-500">
        <div className="relative w-16 h-24 lg:w-20 lg:h-28 rounded-xl overflow-hidden flex-shrink-0 border border-[#36C7E8]/50 shadow-[0_10px_25px_rgba(0,0,0,0.7)]">
          <Image
            src="/images/editorial-mermaid.png"
            alt="Editorial Underwater Mermaid Art"
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="text-left space-y-1 max-w-[150px]">
          <span className="text-[9px] tracking-[0.3em] font-mono text-[#D94B73] uppercase block font-semibold">
            EDITORIAL ARTWORK
          </span>
          <h4 className="font-serif text-xs font-light text-[#F5F7F8] tracking-wide">
            Fluid Transcendence
          </h4>
          <p className="text-[10px] text-[#F5F7F8]/70 font-light leading-relaxed">
            Choreography echoing ancient underwater rhythms.
          </p>
        </div>
      </div>

      {/* Right: Editorial Typography */}
      <div className="max-w-md text-center sm:text-right sm:ml-auto">
        <div className="flex justify-center sm:justify-end">
          <SectionLabel number="03" title="THE ART OF MOVEMENT" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-[#F5F7F8] uppercase tracking-[0.04em] leading-[0.95] mt-2 md:mt-4">
          <span className="block">THE</span>
          <span className="block italic text-[#36C7E8]">ART OF</span>
          <span className="block text-[#D94B73]">MOVEMENT</span>
        </h2>
        <div className="mt-3 sm:mt-4 md:mt-8 space-y-1 text-xs sm:text-sm font-serif text-[#F5F7F8]/80 tracking-[0.2em] uppercase border-r-2 sm:border-r-2 border-[#D94B73]/60 pr-2 sm:pr-4">
          <p>Weightless.</p>
          <p>Timeless.</p>
          <p>Beautiful.</p>
        </div>
      </div>
    </div>
  );
}

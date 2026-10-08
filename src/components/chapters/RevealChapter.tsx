"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";

interface RevealChapterProps {
  opacity: number;
}

export function RevealChapter({ opacity }: RevealChapterProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 lg:px-24 pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
    >
      <div className="max-w-xl self-start">
        <SectionLabel number="02" title="THE REVEAL" />
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#F5F7F8] uppercase tracking-[0.04em] leading-[0.95] mt-2 md:mt-4">
          <span className="block">THERE IS</span>
          <span className="block italic text-[#36C7E8]">ANOTHER WORLD</span>
          <span className="block text-[#D94B73]">BELOW.</span>
        </h2>
        <p className="mt-4 md:mt-8 text-xs md:text-sm text-[#F5F7F8]/60 font-light tracking-[0.2em] uppercase border-l border-[#36C7E8]/40 pl-4 max-w-sm md:max-w-md">
          Submerged in deep blue shadows, time bends beneath the light.
        </p>
      </div>
    </div>
  );
}

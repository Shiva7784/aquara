"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";

interface DescentChapterProps {
  opacity: number;
}

export function DescentChapter({ opacity }: DescentChapterProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 md:px-6 pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
    >
      <SectionLabel number="05" title="DESCENT" />
      <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-[#F5F7F8] uppercase tracking-[0.1em] leading-tight mt-2 md:mt-4">
        <span className="block">KEEP</span>
        <span className="block italic text-[#36C7E8]">GOING</span>
        <span className="block text-[#D94B73]">DEEPER.</span>
      </h2>
    </div>
  );
}

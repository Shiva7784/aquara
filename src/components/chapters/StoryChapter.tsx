"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";

interface StoryChapterProps {
  opacity: number;
}

export function StoryChapter({ opacity }: StoryChapterProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-end pb-12 sm:pb-16 md:pb-24 px-4 sm:px-8 md:px-16 lg:px-24 pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
    >
      <div className="max-w-md sm:max-w-xl md:max-w-2xl">
        <SectionLabel number="04" title="THE RUINS" />
        <span className="text-[9px] sm:text-[10px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-[#D94B73] font-mono block mb-1.5 sm:mb-2">
          THE STORY
        </span>
        <h3 className="font-serif text-xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-[#F5F7F8] tracking-wide leading-tight">
          Somewhere beneath the surface, time moves differently.
        </h3>
      </div>
    </div>
  );
}

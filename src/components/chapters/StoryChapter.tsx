"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";

interface StoryChapterProps {
  opacity: number;
}

export function StoryChapter({ opacity }: StoryChapterProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-16 lg:px-24 pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
    >
      <div className="max-w-xl md:max-w-2xl">
        <SectionLabel number="04" title="THE RUINS" />
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#D94B73] font-mono block mb-2">
          THE STORY
        </span>
        <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#F5F7F8] tracking-wide leading-tight">
          Somewhere beneath the surface, time moves differently.
        </h3>
      </div>
    </div>
  );
}

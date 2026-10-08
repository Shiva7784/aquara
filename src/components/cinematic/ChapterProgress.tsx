"use client";

import { CHAPTERS } from "@/lib/constants";

interface ChapterProgressProps {
  activeChapterId: number;
  currentProgress: number; // 0 to 1
}

export function ChapterProgress({ activeChapterId, currentProgress }: ChapterProgressProps) {
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 text-[10px] tracking-[0.25em] font-mono pointer-events-none select-none">
      {CHAPTERS.map((ch) => {
        const isActive = ch.id === activeChapterId;
        return (
          <div
            key={ch.id}
            className={`flex items-center gap-3 transition-all duration-500 ${
              isActive
                ? "text-[#F5F7F8] opacity-100 translate-x-1"
                : "text-[#F5F7F8]/30 opacity-40"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                isActive ? "bg-[#D94B73] scale-125 shadow-[0_0_8px_#D94B73]" : "bg-white/20"
              }`}
            />
            <span>{ch.code}</span>
          </div>
        );
      })}

      {/* Vertical Progress Bar */}
      <div className="w-[1px] h-24 bg-white/10 mt-2 relative overflow-hidden rounded-full ml-0.5">
        <div
          className="w-full bg-gradient-to-b from-[#36C7E8] to-[#D94B73] transition-all duration-300"
          style={{ height: `${currentProgress * 100}%` }}
        />
      </div>
    </div>
  );
}

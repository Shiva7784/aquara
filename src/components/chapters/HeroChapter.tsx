import { memo } from "react";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";

interface HeroChapterProps {
  opacity: number;
}

export const HeroChapter = memo(function HeroChapter({ opacity }: HeroChapterProps) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-between items-center px-4 sm:px-6 py-6 sm:py-10 md:py-12 pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
    >
      {/* Top Tagline */}
      <div className="pt-10 sm:pt-12 md:pt-6 text-center">
        <span className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-[#36C7E8]/80 font-mono">
          CINEMATIC FILM EXPERIENCE
        </span>
      </div>

      {/* Hero Typography */}
      <div className="flex flex-col items-center text-center max-w-4xl my-auto px-2">
        <h1 className="font-serif leading-[0.88] tracking-tight font-extralight text-[#F5F7F8]">
          <span
            className="block uppercase"
            style={{ fontSize: "clamp(2.2rem, 7.5vw, 8.5rem)" }}
          >
            INTO
          </span>
          <span
            className="block italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F5F7F8] via-[#36C7E8] to-[#D94B73] uppercase"
            style={{ fontSize: "clamp(2.2rem, 7.5vw, 8.5rem)" }}
          >
            THE DEEP
          </span>
        </h1>
        <p className="mt-3 sm:mt-4 md:mt-6 text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.2em] sm:tracking-[0.25em] font-light text-[#F5F7F8]/70 uppercase max-w-xs sm:max-w-md">
          A world beneath the surface
        </p>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="pb-2 sm:pb-4">
        <ScrollIndicator />
      </div>
    </div>
  );
});

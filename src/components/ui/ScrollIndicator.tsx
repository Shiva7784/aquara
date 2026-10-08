"use client";

import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 pointer-events-auto">
      <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#02070B]/70 backdrop-blur-md border border-[#36C7E8]/40 shadow-[0_0_15px_rgba(54,199,232,0.2)] animate-bounce">
        <span className="text-[10px] tracking-[0.3em] font-mono text-[#F5F7F8] uppercase font-medium">
          SCROLL TO DESCEND
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#36C7E8]" />
      </div>
      <div className="w-[1px] h-8 bg-gradient-to-b from-[#36C7E8] to-transparent animate-pulse" />
    </div>
  );
}

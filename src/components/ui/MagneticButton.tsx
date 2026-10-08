"use client";

import { useRef, ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MagneticButton({ children, onClick, className = "" }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const btn = buttonRef.current;
    if (!btn) return;

    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center px-8 py-4 text-xs tracking-[0.25em] uppercase font-light border border-[#F5F7F8]/20 hover:border-[#D94B73] rounded-full transition-colors duration-500 group overflow-hidden ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-[#D94B73]/20 to-[#36C7E8]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <span className="relative z-10 text-[#F5F7F8] group-hover:text-[#F5F7F8] transition-colors duration-300 flex items-center gap-3">
        {children}
      </span>
    </button>
  );
}

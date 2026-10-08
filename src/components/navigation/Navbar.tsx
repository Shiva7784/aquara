"use client";

import { MenuButton } from "./MenuButton";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between pointer-events-none">
      {/* Brand Logo */}
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#D94B73] animate-pulse" />
        <span className="font-serif text-sm md:text-base tracking-[0.35em] uppercase text-[#F5F7F8]">
          AQUARA
        </span>
      </div>

      {/* Menu Action */}
      <div className="pointer-events-auto">
        <MenuButton />
      </div>
    </header>
  );
}

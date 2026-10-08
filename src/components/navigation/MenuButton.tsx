"use client";

import { MagneticButton } from "@/components/ui/MagneticButton";

export function MenuButton({ onClick }: { onClick?: () => void }) {
  return (
    <MagneticButton onClick={onClick} className="!px-6 !py-2 text-[10px] tracking-[0.25em]">
      MENU
    </MagneticButton>
  );
}

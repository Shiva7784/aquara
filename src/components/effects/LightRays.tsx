"use client";

import Image from "next/image";

export function LightRays() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Caustics Background Texture Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen">
        <Image
          src="/images/caustics-bg.png"
          alt="Bioluminescent Caustics Texture"
          fill
          className="object-cover"
        />
      </div>

      {/* Volumetric Radial Light Glow */}
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[110vw] h-[55vh] bg-radial from-[#36C7E8]/15 via-[#075B82]/10 to-transparent blur-3xl opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#02070B] via-transparent to-[#02070B]" />
    </div>
  );
}

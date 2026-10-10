"use client";

import { forwardRef } from "react";

interface CinematicCanvasProps {
  poster?: string;
  className?: string;
}

export const CinematicCanvas = forwardRef<HTMLCanvasElement, CinematicCanvasProps>(
  ({ poster = "/videos/underwater-poster.jpg", className = "" }, ref) => {
    return (
      <div
        className={`relative w-full h-full overflow-hidden bg-[#02070B] bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url('${poster}')` }}
      >
        <canvas
          ref={ref}
          className="w-full h-full object-cover object-center pointer-events-none select-none relative z-10"
        />
      </div>
    );
  }
);

CinematicCanvas.displayName = "CinematicCanvas";

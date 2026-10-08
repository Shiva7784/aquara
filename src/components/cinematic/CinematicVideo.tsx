"use client";

import { forwardRef } from "react";

interface CinematicVideoProps {
  src?: string;
  poster?: string;
  className?: string;
  isMobile?: boolean;
}

export const CinematicVideo = forwardRef<HTMLVideoElement, CinematicVideoProps>(
  ({ src = "/videos/underwater-desktop.mp4", poster = "/videos/underwater-poster.jpg", className = "", isMobile = false }, ref) => {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#02070B] ${className}`}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          playsInline
          // @ts-ignore
          webkit-playsinline="true"
          autoPlay={isMobile}
          loop={isMobile}
          preload="auto"
          className="w-full h-full object-cover object-center pointer-events-none select-none"
        />
      </div>
    );
  }
);

CinematicVideo.displayName = "CinematicVideo";

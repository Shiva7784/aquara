"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";

interface CinematicVideoProps {
  progress?: number;
  src?: string;
  poster?: string;
  className?: string;
}

export const CinematicVideo = forwardRef<HTMLVideoElement, CinematicVideoProps>(
  (
    {
      progress = 0,
      src = "/videos/underwater-desktop.mp4",
      poster = "/videos/underwater-poster.jpg",
      className = "",
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const progressRef = useRef(progress);
    progressRef.current = progress;

    useImperativeHandle(ref, () => videoRef.current!, []);

    const drawFrame = useCallback((prog: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const TOTAL_FRAMES = 90;
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(prog * (TOTAL_FRAMES - 1)))
      );
      const img = imagesRef.current[frameIndex];

      if (img && (img.complete || img.naturalWidth > 0)) {
        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);

        const imgRatio = (img.naturalWidth || 1280) / (img.naturalHeight || 720);
        const canvasRatio = w / h;
        let drawW = w;
        let drawH = h;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawH = w / imgRatio;
          offsetY = (h - drawH) / 2;
        } else {
          drawW = h * imgRatio;
          offsetX = (w - drawW) / 2;
        }

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      }
    }, []);

    // Preload 90 WebP frames into GPU memory and trigger instant 0ms initial render
    useEffect(() => {
      const TOTAL_FRAMES = 90;
      const images: HTMLImageElement[] = [];

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(3, "0");
        img.src = `/frames/frame_${frameNum}.webp`;

        // Render immediately as soon as initial frames load
        img.onload = () => {
          if (i === 1 || i === 2) {
            drawFrame(progressRef.current);
          }
        };
        images.push(img);
      }
      imagesRef.current = images;

      // Handle window resize cleanly
      const handleResize = () => {
        drawFrame(progressRef.current);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [drawFrame]);

    // Draw active frame on scroll progress update
    useEffect(() => {
      drawFrame(progress);
    }, [progress, drawFrame]);

    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#02070B] ${className}`}>
        {/* Instant 0ms Visual Background Fallback while WebP textures hydrate */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/frames/frame_001.webp"
          alt="Underwater Hero Background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-80"
        />

        {/* Hardware-Accelerated 60-120FPS WebP Canvas Player */}
        <canvas
          ref={canvasRef}
          className="relative z-10 w-full h-full object-cover pointer-events-none select-none"
        />

        {/* Hidden Video Fallback */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          className="hidden"
        />
      </div>
    );
  }
);

CinematicVideo.displayName = "CinematicVideo";

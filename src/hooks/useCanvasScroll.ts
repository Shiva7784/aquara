"use client";

import { useEffect, useRef, RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { TOTAL_DURATION } from "@/lib/constants";

interface UseCanvasScrollOptions {
  containerRef: RefObject<HTMLElement | null>;
  pinRef?: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  totalFrames?: number;
  posterSrc?: string;
  onProgressUpdate?: (progress: number, displayTime: number) => void;
}

export function useCanvasScroll({
  containerRef,
  pinRef,
  canvasRef,
  totalFrames = 90,
  posterSrc = "/videos/underwater-poster.jpg",
  onProgressUpdate,
}: UseCanvasScrollOptions) {
  const onProgressUpdateRef = useRef(onProgressUpdate);
  onProgressUpdateRef.current = onProgressUpdate;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const pinTarget = pinRef?.current || container;

    if (!container || !canvas || !pinTarget) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Cache preloaded JPG frame images & poster
    const images: HTMLImageElement[] = [];
    const loadedImages: boolean[] = new Array(totalFrames).fill(false);

    let posterLoaded = false;
    const posterImg = new Image();
    posterImg.src = posterSrc;
    posterImg.onload = () => {
      posterLoaded = true;
      currentDrawnFrame = -999;
    };

    let targetProgress = 0;
    let smoothProgress = 0;
    let animationFrameId: number;
    let currentDrawnFrame = -999;

    const padZero = (num: number) => num.toString().padStart(3, "0");

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = pinTarget.clientWidth;
      const height = pinTarget.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
        currentDrawnFrame = -999;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Preload all 90 JPG frame images
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/frames/frame_${padZero(i)}.jpg`;
      const idx = i - 1;
      img.onload = () => {
        loadedImages[idx] = true;
        if (idx === 0 || idx === currentDrawnFrame) {
          currentDrawnFrame = -999;
        }
      };
      images.push(img);
    }

    const drawAspectCover = (img: HTMLImageElement) => {
      if (!img || img.naturalWidth === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvasWidth = canvas.width / dpr;
      const canvasHeight = canvas.height / dpr;

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgAspect = imgWidth / imgHeight;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawW: number, drawH: number, drawX: number, drawY: number;

      if (canvasAspect > imgAspect) {
        drawW = canvasWidth;
        drawH = canvasWidth / imgAspect;
        drawX = 0;
        drawY = (canvasHeight - drawH) / 2;
      } else {
        drawH = canvasHeight;
        drawW = canvasHeight * imgAspect;
        drawX = (canvasWidth - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    const renderLoop = () => {
      // Smooth lerp progress for fluid motion on scroll
      const diff = targetProgress - smoothProgress;
      if (Math.abs(diff) > 0.0001) {
        smoothProgress += diff * 0.25;
      } else {
        smoothProgress = targetProgress;
      }

      const frameIdx = Math.min(
        totalFrames - 1,
        Math.max(0, Math.floor(smoothProgress * (totalFrames - 1)))
      );

      if (frameIdx !== currentDrawnFrame || !loadedImages[frameIdx]) {
        if (images[frameIdx] && loadedImages[frameIdx]) {
          drawAspectCover(images[frameIdx]);
          currentDrawnFrame = frameIdx;
        } else if (images[0] && loadedImages[0]) {
          drawAspectCover(images[0]);
        } else if (posterLoaded) {
          drawAspectCover(posterImg);
        }
      }

      if (onProgressUpdateRef.current) {
        const displayTime = smoothProgress * TOTAL_DURATION;
        onProgressUpdateRef.current(smoothProgress, displayTime);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const trigger = ScrollTrigger.create({
      trigger: container,
      pin: pinTarget,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      currentDrawnFrame = -999;
    }, 300);

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      trigger.kill();
    };
  }, [containerRef, pinRef, canvasRef, totalFrames, posterSrc]);
}

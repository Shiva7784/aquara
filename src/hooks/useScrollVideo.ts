"use client";

import { useEffect, RefObject, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { VIDEO_SEEK_START, VIDEO_SEEK_END, TOTAL_DURATION } from "@/lib/constants";

interface UseScrollVideoOptions {
  containerRef: RefObject<HTMLElement | null>;
  pinRef?: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  onTimeUpdate?: (time: number, progress: number) => void;
}

export function useScrollVideo({
  containerRef,
  pinRef,
  videoRef,
  onTimeUpdate,
}: UseScrollVideoOptions) {
  const onTimeUpdateRef = useRef(onTimeUpdate);
  onTimeUpdateRef.current = onTimeUpdate;

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const pinTarget = pinRef?.current || container;

    if (!container || !video || !pinTarget) return;

    video.muted = true;
    video.playsInline = true;
    // @ts-ignore
    if (video.setAttribute) video.setAttribute("webkit-playsinline", "true");
    video.pause();

    const setInitialFrame = () => {
      try {
        video.currentTime = VIDEO_SEEK_START;
      } catch {}
      ScrollTrigger.refresh();
    };

    if (video.readyState >= 1) {
      setInitialFrame();
    } else {
      video.addEventListener("loadedmetadata", setInitialFrame, { once: true });
      video.addEventListener("loadeddata", setInitialFrame, { once: true });
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    // High-Performance 60FPS RAF Engine: Decouples scroll listeners from video hardware decoders
    const renderLoop = () => {
      // Lerp progress smoothly toward target scroll position
      const diff = targetProgress - currentProgress;
      currentProgress += diff * 0.12;

      if (Math.abs(diff) < 0.0001) {
        currentProgress = targetProgress;
      }

      const maxDuration =
        video.duration && !isNaN(video.duration) ? video.duration : TOTAL_DURATION;
      const endSeek = Math.min(VIDEO_SEEK_END, maxDuration - 0.5);
      const targetSeekTime = VIDEO_SEEK_START + currentProgress * (endSeek - VIDEO_SEEK_START);

      // Throttled video currentTime update: only update when decoder is ready and delta > 1 video frame
      if (!video.seeking && Math.abs(video.currentTime - targetSeekTime) > 0.015) {
        try {
          video.currentTime = Math.max(VIDEO_SEEK_START, Math.min(targetSeekTime, endSeek));
        } catch {}
      }

      // Synchronize UI chapter timeline opacities in 100% lockstep with currentProgress
      if (onTimeUpdateRef.current) {
        const displayTime = currentProgress * TOTAL_DURATION;
        onTimeUpdateRef.current(displayTime, currentProgress);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const trigger = ScrollTrigger.create({
      trigger: container,
      pin: pinTarget,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      clearTimeout(refreshTimer);
      cancelAnimationFrame(animationFrameId);
      trigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

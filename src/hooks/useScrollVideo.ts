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

    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice) {
      // On mobile touch devices, play video natively at 60-120fps to prevent mobile GPU/decoder keyframe seeking lag
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.play().catch(() => {});

      const trigger = ScrollTrigger.create({
        trigger: container,
        pin: pinTarget,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (onTimeUpdateRef.current) {
            const displayTime = self.progress * TOTAL_DURATION;
            onTimeUpdateRef.current(displayTime, self.progress);
          }
        },
      });

      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        clearTimeout(refreshTimer);
        trigger.kill();
      };
    }

    // On Desktop devices, use frame-by-frame JS video scrubbing
    video.muted = true;
    video.playsInline = true;
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
    let targetTime = VIDEO_SEEK_START;
    let currentTime = VIDEO_SEEK_START;

    const updateVideoSeek = () => {
      const maxDuration =
        video.duration && !isNaN(video.duration) ? video.duration : TOTAL_DURATION;
      const endSeek = Math.min(VIDEO_SEEK_END, maxDuration - 0.5);

      currentTime += (targetTime - currentTime) * 0.15;

      if (Math.abs(targetTime - currentTime) > 0.005) {
        try {
          video.currentTime = Math.max(VIDEO_SEEK_START, Math.min(currentTime, endSeek));
        } catch {}
      }

      if (onTimeUpdateRef.current) {
        const displayTime = ((currentTime - VIDEO_SEEK_START) / (endSeek - VIDEO_SEEK_START)) * TOTAL_DURATION;
        const currentProgress = (currentTime - VIDEO_SEEK_START) / (endSeek - VIDEO_SEEK_START);
        onTimeUpdateRef.current(Math.max(0, displayTime), Math.max(0, currentProgress));
      }

      animationFrameId = requestAnimationFrame(updateVideoSeek);
    };

    const trigger = ScrollTrigger.create({
      trigger: container,
      pin: pinTarget,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const maxDuration =
          video.duration && !isNaN(video.duration) ? video.duration : TOTAL_DURATION;
        const endSeek = Math.min(VIDEO_SEEK_END, maxDuration - 0.5);

        targetTime = VIDEO_SEEK_START + self.progress * (endSeek - VIDEO_SEEK_START);
      },
    });

    // Refresh ScrollTrigger after mount to ensure correct height calculations on Vercel
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    animationFrameId = requestAnimationFrame(updateVideoSeek);

    return () => {
      clearTimeout(refreshTimer);
      trigger.kill();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

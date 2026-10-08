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
    video.pause();

    // Set initial frame to 2.0s immediately on load so background is bright and illuminated
    const setInitialFrame = () => {
      try {
        video.currentTime = VIDEO_SEEK_START;
      } catch {}
    };

    if (video.readyState >= 2) {
      setInitialFrame();
    } else {
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

      // Smooth lerp seek towards target scroll time
      currentTime += (targetTime - currentTime) * 0.15;

      if (Math.abs(targetTime - currentTime) > 0.005) {
        try {
          video.currentTime = Math.max(VIDEO_SEEK_START, Math.min(currentTime, endSeek));
        } catch {}
      }

      if (onTimeUpdateRef.current) {
        // Map global display time from 0 to 40s
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
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: (self) => {
        const maxDuration =
          video.duration && !isNaN(video.duration) ? video.duration : TOTAL_DURATION;
        const endSeek = Math.min(VIDEO_SEEK_END, maxDuration - 0.5);

        // Map scroll 0 -> 1 to video seeking range (2.0s -> 38.5s)
        targetTime = VIDEO_SEEK_START + self.progress * (endSeek - VIDEO_SEEK_START);
      },
    });

    animationFrameId = requestAnimationFrame(updateVideoSeek);

    return () => {
      trigger.kill();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

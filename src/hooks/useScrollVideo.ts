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

    // Direct synchronous scroll-to-video seeking engine for 1:1 perfect lockstep UI sync
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

        // 1:1 Map scroll progress directly to video timestamp
        const seekTime = VIDEO_SEEK_START + self.progress * (endSeek - VIDEO_SEEK_START);

        // Direct seek without artificial lerp delay to eliminate UI/Video lag disconnect
        try {
          if (!video.seeking) {
            video.currentTime = Math.max(VIDEO_SEEK_START, Math.min(seekTime, endSeek));
          }
        } catch {}

        // 1:1 Map UI chapter timeline to exact scroll progress
        if (onTimeUpdateRef.current) {
          const displayTime = self.progress * TOTAL_DURATION;
          onTimeUpdateRef.current(displayTime, self.progress);
        }
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      trigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

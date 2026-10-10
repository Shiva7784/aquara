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

    const videoEl: HTMLVideoElement = video;
    videoEl.muted = true;
    videoEl.playsInline = true;
    // @ts-ignore
    if (videoEl.setAttribute) videoEl.setAttribute("webkit-playsinline", "true");
    videoEl.pause();

    const setInitialFrame = () => {
      try {
        videoEl.currentTime = VIDEO_SEEK_START;
      } catch {}
      ScrollTrigger.refresh();
    };

    if (videoEl.readyState >= 1) {
      setInitialFrame();
    } else {
      videoEl.addEventListener("loadedmetadata", setInitialFrame, { once: true });
      videoEl.addEventListener("loadeddata", setInitialFrame, { once: true });
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    // Pure Scroll-Bound Frame Engine: Video ONLY moves when user actively scrolls. Zero auto-playing.
    const renderLoop = () => {
      // Lerp smooth scroll interpolation
      const diff = targetProgress - currentProgress;
      currentProgress += diff * 0.25;

      if (Math.abs(diff) < 0.0001) {
        currentProgress = targetProgress;
      }

      const maxDuration =
        videoEl.duration && !isNaN(videoEl.duration) ? videoEl.duration : TOTAL_DURATION;
      const endSeek = Math.min(VIDEO_SEEK_END, maxDuration - 0.5);
      const targetTime = VIDEO_SEEK_START + currentProgress * (endSeek - VIDEO_SEEK_START);

      // Mutate video currentTime ONLY when crossing 1 full video frame boundary (~0.04s at 25fps) and decoder is ready
      const minFrameStep = 0.04;
      if (!videoEl.seeking && Math.abs(videoEl.currentTime - targetTime) >= minFrameStep) {
        try {
          const vAny = videoEl as any;
          const seekTo = Math.max(VIDEO_SEEK_START, Math.min(targetTime, endSeek));
          if (typeof vAny.fastSeek === "function") {
            vAny.fastSeek(seekTo);
          } else {
            videoEl.currentTime = seekTo;
          }
        } catch {}
      }

      // Synchronize UI chapter timeline opacities in 100% lockstep with scroll progress
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

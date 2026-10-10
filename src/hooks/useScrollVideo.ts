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

    video.muted = true;
    video.playsInline = true;
    // @ts-ignore
    if (video.setAttribute) video.setAttribute("webkit-playsinline", "true");
    video.pause();

    let isSeeking = false;
    const onSeeking = () => { isSeeking = true; };
    const onSeeked = () => { isSeeking = false; };

    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);

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
    const lerpFactor = isTouchDevice ? 0.25 : 0.15;
    const minDelta = isTouchDevice ? 0.02 : 0.005;

    const updateVideoSeek = () => {
      const maxDuration =
        video.duration && !isNaN(video.duration) ? video.duration : TOTAL_DURATION;
      const endSeek = Math.min(VIDEO_SEEK_END, maxDuration - 0.5);

      // Smooth lerp towards scroll target
      currentTime += (targetTime - currentTime) * lerpFactor;
      const desiredTime = Math.max(VIDEO_SEEK_START, Math.min(currentTime, endSeek));

      // Guard against hardware decode cancellation: only mutate currentTime if NOT currently seeking
      if (!isSeeking && !video.seeking && Math.abs(video.currentTime - desiredTime) > minDelta) {
        try {
          if ("fastSeek" in video && isTouchDevice) {
            (video as any).fastSeek(desiredTime);
          } else {
            video.currentTime = desiredTime;
          }
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
      scrub: isTouchDevice ? 0.1 : true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const maxDuration =
          video.duration && !isNaN(video.duration) ? video.duration : TOTAL_DURATION;
        const endSeek = Math.min(VIDEO_SEEK_END, maxDuration - 0.5);

        targetTime = VIDEO_SEEK_START + self.progress * (endSeek - VIDEO_SEEK_START);
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    animationFrameId = requestAnimationFrame(updateVideoSeek);

    return () => {
      clearTimeout(refreshTimer);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
      trigger.kill();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

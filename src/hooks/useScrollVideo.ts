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
    const video = videoRef.current as HTMLVideoElement | null;
    const pinTarget = pinRef?.current || container;

    if (!container || !video || !pinTarget) return;
    const videoEl: HTMLVideoElement = video;

    video.muted = true;
    video.playsInline = true;
    // @ts-ignore
    if (video.setAttribute) video.setAttribute("webkit-playsinline", "true");

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
    let isScrolling = false;
    let scrollStopTimer: NodeJS.Timeout | null = null;

    // High-Performance Velocity-Synced Video Playback Engine (60-120 FPS Zero-Stutter)
    const renderLoop = () => {
      const maxDuration =
        videoEl.duration && !isNaN(videoEl.duration) ? videoEl.duration : TOTAL_DURATION;
      const endSeek = Math.min(VIDEO_SEEK_END, maxDuration - 0.5);
      const targetTime = VIDEO_SEEK_START + targetProgress * (endSeek - VIDEO_SEEK_START);
      const currentVideoTime = videoEl.currentTime;
      const timeDiff = targetTime - currentVideoTime;

      if (isScrolling) {
        if (timeDiff > 0.15) {
          if (videoEl.paused) {
            videoEl.play().catch(() => {});
          }
          const desiredRate = Math.min(3.5, Math.max(0.6, timeDiff * 1.8));
          videoEl.playbackRate = desiredRate;
        } else if (timeDiff < -0.2) {
          if (!videoEl.paused) videoEl.pause();
          if (!videoEl.seeking) {
            try {
              if ("fastSeek" in videoEl) {
                (videoEl as any).fastSeek(Math.max(VIDEO_SEEK_START, targetTime));
              } else {
                videoEl.currentTime = Math.max(VIDEO_SEEK_START, targetTime);
              }
            } catch {}
          }
        } else {
          if (videoEl.paused && timeDiff > 0.02) {
            videoEl.play().catch(() => {});
          }
          videoEl.playbackRate = 1.0;
        }
      } else {
        if (!videoEl.paused && Math.abs(timeDiff) < 0.3) {
          videoEl.pause();
        }
      }

      // Synchronize UI chapter timeline opacities in 100% lockstep with actual video time
      if (onTimeUpdateRef.current) {
        const actualProgress = Math.max(
          0,
          Math.min(1, (currentVideoTime - VIDEO_SEEK_START) / (endSeek - VIDEO_SEEK_START))
        );
        const displayTime = actualProgress * TOTAL_DURATION;
        onTimeUpdateRef.current(displayTime, actualProgress);
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
        isScrolling = true;

        if (scrollStopTimer) clearTimeout(scrollStopTimer);
        scrollStopTimer = setTimeout(() => {
          isScrolling = false;
        }, 150);
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      if (scrollStopTimer) clearTimeout(scrollStopTimer);
      clearTimeout(refreshTimer);
      cancelAnimationFrame(animationFrameId);
      trigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

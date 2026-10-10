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
    let isScrolling = false;
    let stopTimer: NodeJS.Timeout | null = null;

    // Instant-Pause Velocity Playback Engine (Native 60FPS Video + Instant Scroll-Stop Pause)
    const renderLoop = () => {
      const maxDuration =
        videoEl.duration && !isNaN(videoEl.duration) ? videoEl.duration : TOTAL_DURATION;
      const endSeek = Math.min(VIDEO_SEEK_END, maxDuration - 0.5);
      const targetTime = VIDEO_SEEK_START + targetProgress * (endSeek - VIDEO_SEEK_START);
      const curTime = videoEl.currentTime;
      const timeDiff = targetTime - curTime;

      if (isScrolling) {
        if (timeDiff > 0.1) {
          // Scrolling Down: Hardware 60-120FPS native playback with velocity rate matching
          if (videoEl.paused) {
            videoEl.play().catch(() => {});
          }
          videoEl.playbackRate = Math.min(3.0, Math.max(0.8, timeDiff * 2.0));
        } else if (timeDiff < -0.15) {
          // Scrolling Up: Smooth step seek
          if (!videoEl.paused) videoEl.pause();
          if (!videoEl.seeking) {
            try {
              const vAny = videoEl as any;
              if (typeof vAny.fastSeek === "function") {
                vAny.fastSeek(Math.max(VIDEO_SEEK_START, targetTime));
              } else {
                videoEl.currentTime = Math.max(VIDEO_SEEK_START, targetTime);
              }
            } catch {}
          }
        } else {
          // At target time: normal rate
          if (videoEl.paused && timeDiff > 0.02) {
            videoEl.play().catch(() => {});
          }
          videoEl.playbackRate = 1.0;
        }
      } else {
        // User stopped scrolling: Pause video IMMEDIATELY (Zero auto-scrolling)
        if (!videoEl.paused) {
          videoEl.pause();
        }
      }

      // Synchronize UI chapter timeline opacities in 100% lockstep with actual video position
      if (onTimeUpdateRef.current) {
        const actualProgress = Math.max(
          0,
          Math.min(1, (curTime - VIDEO_SEEK_START) / (endSeek - VIDEO_SEEK_START))
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

        if (stopTimer) clearTimeout(stopTimer);
        // Instant 80ms scroll stop detection
        stopTimer = setTimeout(() => {
          isScrolling = false;
        }, 80);
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      if (stopTimer) clearTimeout(stopTimer);
      clearTimeout(refreshTimer);
      cancelAnimationFrame(animationFrameId);
      trigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

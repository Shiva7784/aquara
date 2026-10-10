"use client";

import { useRef, useState, useCallback } from "react";
import { CinematicVideo } from "./CinematicVideo";
import { ChapterProgress } from "./ChapterProgress";
import { HeroChapter } from "@/components/chapters/HeroChapter";
import { RevealChapter } from "@/components/chapters/RevealChapter";
import { MovementChapter } from "@/components/chapters/MovementChapter";
import { StoryChapter } from "@/components/chapters/StoryChapter";
import { DescentChapter } from "@/components/chapters/DescentChapter";
import { FinalChapter } from "@/components/chapters/FinalChapter";
import { FilmGrain } from "@/components/effects/FilmGrain";
import { Vignette } from "@/components/effects/Vignette";
import { WaterParticles } from "@/components/effects/WaterParticles";
import { LightRays } from "@/components/effects/LightRays";
import { useScrollVideo } from "@/hooks/useScrollVideo";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  HERO_START,
  HERO_END,
  REVEAL_START,
  REVEAL_END,
  MOVEMENT_START,
  MOVEMENT_END,
  STORY_START,
  STORY_END,
  DESCENT_START,
  DESCENT_END,
  FINAL_START,
  FINAL_END,
  TOTAL_DURATION,
} from "@/lib/constants";

export function CinematicExperience() {
  const containerRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [currentTime, setCurrentTime] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [activeChapterId, setActiveChapterId] = useState(1);

  // Precise opacity calculation for seamless chapter transitions
  const getOpacity = (time: number, start: number, end: number, fadeTime = 1.0) => {
    if (time < start || time > end) return 0;
    let opacity = 1;

    if (start === 0) {
      // Hero chapter is 100% visible immediately at time = 0
      if (time > end - fadeTime) {
        opacity = (end - time) / fadeTime;
      } else {
        opacity = 1.0;
      }
    } else if (end >= TOTAL_DURATION || end >= 40) {
      // Final chapter fades in and STAYS at 100% opacity continuously at max scroll
      if (time < start + fadeTime) {
        opacity = (time - start) / fadeTime;
      } else {
        opacity = 1.0;
      }
    } else {
      if (time < start + fadeTime) {
        opacity = (time - start) / fadeTime;
      } else if (time > end - fadeTime) {
        opacity = (end - time) / fadeTime;
      }
    }
    return Math.max(0, Math.min(1, opacity));
  };

  const handleTimeUpdate = useCallback((time: number, progress: number) => {
    setCurrentTime(time);
    setCurrentProgress(progress);

    // Active Chapter Identification
    if (time < REVEAL_START) setActiveChapterId(1);
    else if (time < MOVEMENT_START) setActiveChapterId(2);
    else if (time < STORY_START) setActiveChapterId(3);
    else if (time < DESCENT_START) setActiveChapterId(4);
    else if (time < FINAL_START) setActiveChapterId(5);
    else setActiveChapterId(6);
  }, []);

  useScrollVideo({
    containerRef,
    pinRef,
    videoRef,
    onTimeUpdate: handleTimeUpdate,
  });

  const heroOpacity = getOpacity(currentTime, HERO_START, HERO_END, 1.2);
  const revealOpacity = getOpacity(currentTime, REVEAL_START, REVEAL_END, 1.0);
  const movementOpacity = getOpacity(currentTime, MOVEMENT_START, MOVEMENT_END, 1.0);
  const storyOpacity = getOpacity(currentTime, STORY_START, STORY_END, 1.0);
  const descentOpacity = getOpacity(currentTime, DESCENT_START, DESCENT_END, 1.0);
  const finalOpacity = getOpacity(currentTime, FINAL_START, FINAL_END, 0.6);

  const videoSource = isMobile ? "/videos/underwater-mobile.mp4" : "/videos/underwater-desktop.mp4";

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[600vh] bg-[#02070B] text-[#F5F7F8]"
    >
      {/* GSAP Pinned Single Full-Screen Video & Content Viewport */}
      <div ref={pinRef} className="relative w-full h-screen overflow-hidden">
        {/* Atmosphere & Lighting */}
        <LightRays />
        <WaterParticles count={isMobile ? 15 : 30} />
        <FilmGrain />
        <Vignette />

        {/* Single Pinned Video Element */}
        <div className="absolute inset-0 z-0">
          <CinematicVideo ref={videoRef} src={videoSource} progress={currentProgress} />
        </div>

        {/* Chapter Progress Sidebar (Desktop) */}
        {!isMobile && (
          <ChapterProgress
            activeChapterId={activeChapterId}
            currentProgress={currentProgress}
          />
        )}

        {/* 6 Chapter Overlay Timelines */}
        <HeroChapter opacity={heroOpacity} />
        <RevealChapter opacity={revealOpacity} />
        <MovementChapter opacity={movementOpacity} />
        <StoryChapter opacity={storyOpacity} />
        <DescentChapter opacity={descentOpacity} />
        <FinalChapter opacity={finalOpacity} />
      </div>
    </section>
  );
}

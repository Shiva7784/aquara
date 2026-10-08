export const HERO_START = 0;
export const HERO_END = 10;

export const REVEAL_START = 10;
export const REVEAL_END = 16;

export const MOVEMENT_START = 16;
export const MOVEMENT_END = 24;

export const STORY_START = 24;
export const STORY_END = 30;

export const DESCENT_START = 30;
export const DESCENT_END = 38.5;

export const FINAL_START = 38.5;
export const FINAL_END = 40;

export const TOTAL_DURATION = 40;

// Video Seeking Offset Range (skip initial black fade-in)
export const VIDEO_SEEK_START = 2.0; // Bright illuminated light rays frame
export const VIDEO_SEEK_END = 38.5;   // Deep descent frame before black

export interface ChapterDef {
  id: number;
  key: string;
  name: string;
  code: string;
  start: number;
  end: number;
}

export const CHAPTERS: ChapterDef[] = [
  { id: 1, key: "hero", name: "THE DEEP", code: "01 — THE DEEP", start: HERO_START, end: HERO_END },
  { id: 2, key: "reveal", name: "THE REVEAL", code: "02 — THE REVEAL", start: REVEAL_START, end: REVEAL_END },
  { id: 3, key: "movement", name: "MOVEMENT", code: "03 — MOVEMENT", start: MOVEMENT_START, end: MOVEMENT_END },
  { id: 4, key: "story", name: "THE RUINS", code: "04 — THE RUINS", start: STORY_START, end: STORY_END },
  { id: 5, key: "descent", name: "DESCENT", code: "05 — DESCENT", start: DESCENT_START, end: DESCENT_END },
  { id: 6, key: "final", name: "THE SURFACE", code: "06 — THE SURFACE", start: FINAL_START, end: FINAL_END },
];

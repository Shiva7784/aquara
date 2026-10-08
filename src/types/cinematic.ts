export interface ChapterProgressProps {
  currentProgress: number; // 0 to 1
  currentTime: number; // 0 to 40
  activeChapterId: number;
}

export interface ChapterComponentProps {
  progress: number; // chapter-specific progress 0 to 1
  globalTime: number; // global video time 0 to 40
  isActive: boolean;
}

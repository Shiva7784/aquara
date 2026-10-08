export function getVideoSource(isMobile: boolean): string {
  return isMobile ? "/videos/underwater-mobile.mp4" : "/videos/underwater-desktop.mp4";
}

export function preloadVideoMetadata(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    const video = document.createElement("video");
    video.src = src;
    video.preload = "metadata";
    video.onloadedmetadata = () => resolve();
    video.onerror = () => resolve(); // fallback gracefully
  });
}

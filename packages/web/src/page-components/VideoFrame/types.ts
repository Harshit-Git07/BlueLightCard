export interface VideoProps {
  videoSrc: string;
  className?: string;
}

export type VideoPlayerState = 'playing' | 'paused' | 'ready' | 'error' | 'loading';

import type { ReactNode } from "react";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
}

export function VideoPlayer({
  src,
  poster,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  width = "100%",
  height = "auto",
  children,
}: VideoPlayerProps) {
  return (
    <div>
      <video
        src={src}
        poster={poster}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        width={width}
        height={height}
        playsInline
      >
        Your browser does not support video playback.
      </video>

      {children}
    </div>
  );
}
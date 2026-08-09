import type { ReactNode } from "react";

export interface MediaCardProps {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  children?: ReactNode;
  onClick?: () => void;
}

export function MediaCard({
  id,
  src,
  alt = "",
  width,
  height,
  children,
  onClick,
}: MediaCardProps) {
  return (
    <article
      data-media-id={id}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
      />

      {children}
    </article>
  );
}
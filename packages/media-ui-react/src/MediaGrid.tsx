import type { CSSProperties, ReactNode } from "react";
import { useMediaGrid } from "./useMediaGrid";

export interface MediaGridItem {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  downloadUrl?: string;
}

export interface MediaGridProps {
  items: MediaGridItem[];
  renderItem?: (item: MediaGridItem) => ReactNode;
  /** Styling is deliberately supplied by the consuming application. */
  style?: CSSProperties;
  className?: string;
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
}

export function MediaGrid({
  items,
  renderItem,
  style,
  className,
  hasMore,
  loading,
  onLoadMore,
}: MediaGridProps) {
  const { getGridProps, getItemProps, getLoadMoreSentinelProps } = useMediaGrid({ hasMore, loading, onLoadMore });
  return (
    <div
      {...getGridProps()}
      className={className}
      style={style}
    >
      {items.map((item) => (
        <div key={item.id} {...getItemProps()}>
          {renderItem ? (
            renderItem(item)
          ) : (
            <img
              src={item.src}
              alt={item.alt ?? ""}
              width={item.width}
              height={item.height}
              loading="lazy"
            />
          )}
        </div>
      ))}
      {hasMore && <div {...getLoadMoreSentinelProps()} />}
    </div>
  );
}

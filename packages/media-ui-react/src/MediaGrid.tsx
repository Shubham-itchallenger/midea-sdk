import type { ReactNode } from "react";

export interface MediaGridItem {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface MediaGridProps {
  items: MediaGridItem[];
  renderItem?: (item: MediaGridItem) => ReactNode;
  columns?: number;
  gap?: number;
}

export function MediaGrid({
  items,
  renderItem,
  columns = 4,
  gap = 16,
}: MediaGridProps) {
  return (
    <div
      role="list"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
      }}
    >
      {items.map((item) => (
        <div key={item.id} role="listitem">
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
    </div>
  );
}
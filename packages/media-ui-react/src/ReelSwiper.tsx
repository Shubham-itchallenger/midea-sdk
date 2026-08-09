import { useCallback, useEffect, useRef, type ReactNode } from "react";

export interface ReelItem { id: string; src: string; poster?: string; label?: string; }
export interface ReelSwiperProps { items: ReelItem[]; renderItem: (item: ReelItem) => ReactNode; onActiveChange?: (id: string) => void; }
export function useReelSwiper({ onActiveChange }: Pick<ReelSwiperProps, "onActiveChange">) {
  const observer = useRef<IntersectionObserver | null>(null);
  const getContainerProps = () => ({ role: "feed" as const, "aria-label": "Media reels" });
  const getItemProps = useCallback((id: string) => ({ "data-reel-id": id, ref: (node: Element | null) => { if (!node || !onActiveChange) return; observer.current ??= new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) onActiveChange((entry.target as HTMLElement).dataset.reelId!); }), { threshold: 0.7 }); observer.current.observe(node); } }), [onActiveChange]);
  useEffect(() => () => observer.current?.disconnect(), []);
  return { getContainerProps, getItemProps };
}
export function ReelSwiper({ items, renderItem, onActiveChange }: ReelSwiperProps) {
  const { getContainerProps, getItemProps } = useReelSwiper({ onActiveChange });
  return <div {...getContainerProps()} style={{ height: "100%", overflowY: "auto", scrollSnapType: "y mandatory" }}>{items.map((item) => <div key={item.id} {...getItemProps(item.id)} style={{ height: "100%", scrollSnapAlign: "start" }}>{renderItem(item)}</div>)}</div>;
}

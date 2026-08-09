import { useCallback, useEffect, useRef } from "react";

export interface UseMediaGridOptions { hasMore?: boolean; loading?: boolean; onLoadMore?: () => void; }

/** Behaviour only: consumers own markup and styling. */
export function useMediaGrid({ hasMore = false, loading = false, onLoadMore }: UseMediaGridOptions) {
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback((node: Element | null) => {
    observer.current?.disconnect();
    if (!node || !hasMore || loading || !onLoadMore) return;
    observer.current = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) onLoadMore(); });
    observer.current.observe(node);
  }, [hasMore, loading, onLoadMore]);
  useEffect(() => () => observer.current?.disconnect(), []);
  return { getGridProps: () => ({ role: "list" as const }), getItemProps: () => ({ role: "listitem" as const }), getLoadMoreSentinelProps: () => ({ ref: sentinelRef, "aria-busy": loading }) };
}

/** Pure React Native UI behaviours: no SDK or Pexels imports. */
import { useCallback, useRef } from "react";

export interface NativeMediaItem { id: string; src: string; alt?: string; }
export function useMediaGrid({ hasMore = false, loading = false, onLoadMore }: { hasMore?: boolean; loading?: boolean; onLoadMore?: () => void }) {
  return { getListProps: () => ({ onEndReached: () => { if (hasMore && !loading) onLoadMore?.(); }, onEndReachedThreshold: 0.5 }) };
}
export function useLightbox(open: boolean, onClose: () => void) {
  return { getModalProps: () => ({ visible: open, transparent: true, onRequestClose: onClose }), getBackdropProps: () => ({ onTouchEnd: onClose }) };
}
export function useReelSwiper(onActiveChange?: (id: string) => void) {
  const activeId = useRef<string | undefined>(undefined);
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<{ item: NativeMediaItem; isViewable: boolean }> }) => {
    const next = viewableItems.find((item) => item.isViewable)?.item.id;
    if (next && next !== activeId.current) { activeId.current = next; onActiveChange?.(next); }
  }, [onActiveChange]);
  return { getListProps: () => ({ pagingEnabled: true, onViewableItemsChanged, viewabilityConfig: { itemVisiblePercentThreshold: 70 } }) };
}

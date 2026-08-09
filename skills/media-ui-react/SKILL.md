# Use `@media/media-ui-react`

This package is headless: it never fetches data or imports the media SDK. Consumer code supplies content, callbacks, and all CSS.

- For a grid, use `useMediaGrid` and spread `getGridProps`, `getItemProps`, and `getLoadMoreSentinelProps` onto consumer markup. Pass `hasMore`, `loading`, and `onLoadMore`.
- `Lightbox` has focus and Escape handling; call it with `open`, `src`, `alt`, and `onClose`. Put visual layout on the consuming app.
- For reels, use `ReelSwiper` or `useReelSwiper`. Its active callback identifies the visible item; use that callback to track a view in the app.
- Preserve the prop getters when wrapping components. Do not replace their roles, dialog semantics, keyboard handling, or intersection observer with styled-only equivalents.

Accessibility checklist: meaningful image alt text, an accessible close control, focusable lightbox content, and a label for custom reel controls.

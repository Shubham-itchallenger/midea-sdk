# Wire `@media/media-react`

Use this skill when adding data access to a React screen.

1. Mount one `MediaProvider` at the application root with the Pexels API key. Do not call `createMediaClient` in a component and do not import `@media/media-core` in the app.
2. Read data with `useMediaSearch({ query, page, perPage })` and render its `loading`, `error`, and empty states.
3. Get event actions with `useMedia()`: call `trackView(id)` when a preview becomes visible and `trackDownload(id)` only after a user download action. Subscribe with `onView`/`onDownload` in an effect and always return the unsubscribe functions.
4. Keep Pexels-shaped data out of UI components. Convert SDK assets to the small prop shape the UI component needs in the app.

Example:

```tsx
const media = useMedia();
const { data, loading, error } = useMediaSearch({ query, page: 1 });
// map data?.assets, then pass callbacks such as onSelect={() => media.trackView(id)}
```

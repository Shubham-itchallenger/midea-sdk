/** React Native adapter. It intentionally contains no data or API logic. */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createMediaClient, type MediaSearchResult, type SearchOptions } from "@media/media-core";

type MediaClient = ReturnType<typeof createMediaClient>;
const MediaContext = createContext<MediaClient | null>(null);

export function MediaProvider({ apiKey, children }: { apiKey: string; children: ReactNode }) {
  const [client] = useState(() => createMediaClient({ apiKey }));
  return <MediaContext.Provider value={client}>{children}</MediaContext.Provider>;
}
export function useMedia(): MediaClient {
  const client = useContext(MediaContext);
  if (!client) throw new Error("useMedia must be used inside a MediaProvider");
  return client;
}
export function useMediaSearch(options: SearchOptions) {
  const media = useMedia();
  const [data, setData] = useState<MediaSearchResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let current = true;
    if (!options.query.trim()) { setData(null); return; }
    setLoading(true); setError(null);
    media.search(options).then((result) => current && setData(result)).catch((reason: unknown) => current && setError(reason instanceof Error ? reason : new Error("Failed to load media"))).finally(() => current && setLoading(false));
    return () => { current = false; };
  }, [media, options.query, options.page, options.perPage]);
  return { data, error, loading };
}

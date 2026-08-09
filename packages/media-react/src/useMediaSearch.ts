import { useCallback, useEffect, useState } from "react";
import type {
  MediaSearchResult,
  SearchOptions,
} from "@media/media-core";
import { useMedia } from "./useMedia";

interface UseMediaSearchOptions {
  query: string;
  page?: number;
  perPage?: number;
}

export function useMediaSearch({
  query,
  page = 1,
  perPage = 20,
}: UseMediaSearchOptions) {
  const media = useMedia();

  const [data, setData] = useState<MediaSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMedia = useCallback(async () => {
    if (!query.trim()) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const options: SearchOptions = {
        query,
        page,
        perPage,
      };

      const result = await media.search(options);

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to load media"),
      );
    } finally {
      setLoading(false);
    }
  }, [media, query, page, perPage]);

  useEffect(() => {
    void fetchMedia();
  }, [fetchMedia]);

  return {
    data,
    loading,
    error,
    refetch: fetchMedia,
  };
}
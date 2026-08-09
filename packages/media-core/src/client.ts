import { MemoryCache } from "./cache";
import { MediaEventEmitter } from "./events";
import { MediaError } from "./errors";
import type {
  MediaAsset,
  MediaPhoto,
  MediaSearchResult,
  MediaVideo,
} from "./types";
import { PexelsClient } from "./pexels/client";

export interface MediaClientConfig {
  apiKey: string;
}

export interface SearchOptions {
  query: string;
  page?: number;
  perPage?: number;
}

export interface PaginationOptions {
  page?: number;
  perPage?: number;
}

export function createMediaClient(config: MediaClientConfig) {
  const pexels = new PexelsClient({
    apiKey: config.apiKey,
  });

  const cache = new MemoryCache();
  const events = new MediaEventEmitter();

  events.on("view", (event) => {
  console.log("[media-sdk] view", event);
});

events.on("download", (event) => {
  console.log("[media-sdk] download", event);
});

  async function search(
    options: SearchOptions,
  ): Promise<MediaSearchResult> {
    if (!options.query.trim()) {
      throw new MediaError("Search query is required", {
        code: "INVALID_QUERY",
      });
    }

    const page = options.page ?? 1;
    const perPage = options.perPage ?? 20;

    const cacheKey = `search:${options.query}:${page}:${perPage}`;

    const cached = cache.get<MediaSearchResult>(cacheKey);

    if (cached) {
      return cached;
    }

    const [photos, videos] = await Promise.all([
      pexels.searchPhotos(options.query, page, perPage),
      pexels.searchVideos(options.query, page, perPage),
    ]);

    const assets: MediaAsset[] = [
      ...photos.photos.map(mapPhoto),
      ...videos.videos.map(mapVideo),
    ];

    const result: MediaSearchResult = {
      assets,
      pagination: {
        page,
        perPage,
        totalResults: photos.total_results + videos.total_results,
        nextPage: photos.next_page ?? videos.next_page,
        prevPage: photos.prev_page ?? videos.prev_page,
      },
    };

    cache.set(cacheKey, result);

    return result;
  }

  async function curated(
    options: PaginationOptions = {},
  ): Promise<MediaSearchResult> {
    const page = options.page ?? 1;
    const perPage = options.perPage ?? 20;

    const cacheKey = `curated:${page}:${perPage}`;

    const cached = cache.get<MediaSearchResult>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await pexels.getCuratedPhotos(page, perPage);

    const result: MediaSearchResult = {
      assets: response.photos.map(mapPhoto),
      pagination: {
        page: response.page,
        perPage: response.per_page,
        totalResults: response.total_results,
        nextPage: response.next_page,
        prevPage: response.prev_page,
      },
    };

    cache.set(cacheKey, result);

    return result;
  }

  async function getPhoto(id: string): Promise<MediaPhoto> {
    const cacheKey = `photo:${id}`;

    const cached = cache.get<MediaPhoto>(cacheKey);

    if (cached) {
      return cached;
    }

    const photo = mapPhoto(await pexels.getPhoto(id));

    cache.set(cacheKey, photo);

    return photo;
  }

  async function getVideo(id: string): Promise<MediaVideo> {
    const cacheKey = `video:${id}`;

    const cached = cache.get<MediaVideo>(cacheKey);

    if (cached) {
      return cached;
    }

    const video = mapVideo(await pexels.getVideo(id));

    cache.set(cacheKey, video);

    return video;
  }

  function trackView(mediaId: string): void {
    events.emit("view", mediaId);
  }

  function trackDownload(mediaId: string): void {
    events.emit("download", mediaId);
  }

  function onView(
    listener: Parameters<MediaEventEmitter["on"]>[1],
  ): () => void {
    return events.on("view", listener);
  }

  function onDownload(
    listener: Parameters<MediaEventEmitter["on"]>[1],
  ): () => void {
    return events.on("download", listener);
  }

  return {
    search,
    curated,
    getPhoto,
    getVideo,
    trackView,
    trackDownload,
    onView,
    onDownload,
  };
}

function mapPhoto(photo: {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    medium: string;
  };
}): MediaPhoto {
  return {
    id: String(photo.id),
    type: "photo",
    width: photo.width,
    height: photo.height,
    url: photo.url,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    sourceUrl: photo.url,
    thumbnailUrl: photo.src.medium,
  };
}

function mapVideo(video: {
  id: number;
  width: number;
  height: number;
  duration: number;
  url: string;
  image: string;
  user: {
    name: string;
    url: string;
  };
  video_files: Array<{
    id: number;
    width?: number;
    height?: number;
    quality: string;
    file_type: string;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
    nr: number;
  }>;
}): MediaVideo {
  return {
    id: String(video.id),
    type: "video",
    width: video.width,
    height: video.height,
    duration: video.duration,
    url: video.url,
    image: video.image,
    userName: video.user.name,
    userUrl: video.user.url,
    videoFiles: video.video_files.map((file) => ({
      id: file.id,
      width: file.width ?? 0,
      height: file.height ?? 0,
      quality: file.quality,
      fileType: file.file_type,
      link: file.link,
    })),
    videoPictures: video.video_pictures,
  };
}
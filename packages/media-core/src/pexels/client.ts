import type {
  PexelsPhotoResponse,
  PexelsVideoResponse,
  PexelsPhoto,
  PexelsVideo,
} from "./types";

import { MediaError } from "../errors";

const PEXELS_API_URL = "https://api.pexels.com";

export interface PexelsClientConfig {
  apiKey: string;
}

export class PexelsClient {
  private readonly apiKey: string;

  constructor(config: PexelsClientConfig) {
    if (!config.apiKey) {
      throw new MediaError("Pexels API key is required", {
        code: "MISSING_API_KEY",
      });
    }

    this.apiKey = config.apiKey;
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${PEXELS_API_URL}${path}`, {
      headers: {
        Authorization: this.apiKey,
      },
    });

    if (!response.ok) {
      throw new MediaError(
        `Pexels API request failed with status ${response.status}`,
        {
          code: "PEXELS_API_ERROR",
          status: response.status,
        },
      );
    }

    return response.json() as Promise<T>;
  }

  async searchPhotos(
    query: string,
    page = 1,
    perPage = 20,
  ): Promise<PexelsPhotoResponse> {
    const params = new URLSearchParams({
      query,
      page: String(page),
      per_page: String(perPage),
    });

    return this.request<PexelsPhotoResponse>(
      `/v1/search?${params.toString()}`,
    );
  }

  async getCuratedPhotos(
    page = 1,
    perPage = 20,
  ): Promise<PexelsPhotoResponse> {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });

    return this.request<PexelsPhotoResponse>(
      `/v1/curated?${params.toString()}`,
    );
  }

  async getPhoto(id: string): Promise<PexelsPhoto> {
    return this.request<PexelsPhoto>(`/v1/photos/${id}`);
  }

  async searchVideos(
    query: string,
    page = 1,
    perPage = 20,
  ): Promise<PexelsVideoResponse> {
    const params = new URLSearchParams({
      query,
      page: String(page),
      per_page: String(perPage),
    });

    return this.request<PexelsVideoResponse>(
      `/videos/search?${params.toString()}`,
    );
  }

  async getVideo(id: string): Promise<PexelsVideo> {
    return this.request<PexelsVideo>(`/videos/videos/${id}`);
  }
}
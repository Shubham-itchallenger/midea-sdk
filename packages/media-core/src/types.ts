export type MediaType = "photo" | "video";

export interface MediaPhoto {
  id: string;
  type: "photo";
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographerUrl: string;
  sourceUrl: string;
  thumbnailUrl: string;
}

export interface MediaVideoFile {
  id: number;
  width: number;
  height: number;
  quality: string;
  fileType: string;
  link: string;
}

export interface MediaVideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface MediaVideo {
  id: string;
  type: "video";
  width: number;
  height: number;
  duration: number;
  url: string;
  image: string;
  userName: string;
  userUrl: string;
  videoFiles: MediaVideoFile[];
  videoPictures: MediaVideoPicture[];
}

export type MediaAsset = MediaPhoto | MediaVideo;

export interface Pagination {
  page: number;
  perPage: number;
  totalResults: number;
  nextPage?: string;
  prevPage?: string;
}

export interface MediaSearchResult {
  assets: MediaAsset[];
  pagination: Pagination;
}
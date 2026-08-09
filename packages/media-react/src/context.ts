import { createContext } from "react";
import type { createMediaClient } from "@media/media-core";

export type MediaClient = ReturnType<typeof createMediaClient>;

export const MediaContext = createContext<MediaClient | null>(null);
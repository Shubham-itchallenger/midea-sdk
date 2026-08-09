import { useState, type ReactNode } from "react";
import { MediaContext } from "./context";
import { createMediaClient } from "@media/media-core";

interface MediaProviderProps {
  apiKey: string;
  children: ReactNode;
}

export function MediaProvider({
  apiKey,
  children,
}: MediaProviderProps) {
  const [client] = useState(() => createMediaClient({ apiKey }));

  return (
    <MediaContext.Provider value={client}>
      {children}
    </MediaContext.Provider>
  );
}

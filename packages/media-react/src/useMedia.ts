import { useContext } from "react";
import { MediaContext } from "./context";

export function useMedia() {
  const client = useContext(MediaContext);

  if (!client) {
    throw new Error(
      "useMedia must be used inside a MediaProvider",
    );
  }

  return client;
}
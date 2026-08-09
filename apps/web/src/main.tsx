import React from "react";
import ReactDOM from "react-dom/client";
import { MediaProvider } from "@media/media-react";
import App from "./App";

interface ImportMetaEnv {
  readonly VITE_PEXELS_API_KEY?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

if (!apiKey) {
  throw new Error(
    "VITE_PEXELS_API_KEY is not configured",
  );
}

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <MediaProvider apiKey={apiKey}>
      <App />
    </MediaProvider>
  </React.StrictMode>,
);
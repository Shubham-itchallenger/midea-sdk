import { useState, useEffect } from "react";
import { useMediaSearch } from "@media/media-react";
import { Lightbox, MediaGrid, VideoPlayer } from "@media/media-ui-react";
import { createMediaClient } from "@media/media-core";

const client = createMediaClient({
  apiKey: import.meta.env.VITE_PEXELS_API_KEY || "",
});

export default function App() {
  const [query, setQuery] = useState("mountains");
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt?: string;
  } | null>(null);

  const { data, loading, error } = useMediaSearch({
    query,
    page: 1,
    perPage: 20,
  });

  const photos =
    data?.assets
      .filter((asset) => asset.type === "photo")
      .map((asset) => ({
        id: asset.id,
        src: asset.thumbnailUrl,
        alt: `Photo by ${asset.photographer}`,
      })) ?? [];

  const videos = data?.assets.filter((asset) => asset.type === "video") ?? [];

 useEffect(() => {
  const unsubscribeView = client.onView((event) => {
    console.log("Media viewed:", event);
  });

  const unsubscribeDownload = client.onDownload((event) => {
    console.log("Media downloaded:", event);
  });

  return () => {
    unsubscribeView();
    unsubscribeDownload();
  };
}, []);

  return (
    <main style={{ padding: "24px" }}>
      <h1>Media SDK Demo</h1>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search media..."
        style={{
          width: "300px",
          padding: "8px",
          marginBottom: "20px",
        }}
      />

      {loading && <p>Loading...</p>}

      {error && <p role="alert">{error.message}</p>}

      {!loading && !error && photos.length === 0 && <p>No photos found.</p>}

    {photos.length > 0 && (
  <>
    <p>Found {photos.length} photos.</p>

    <MediaGrid
      items={photos}
      columns={4}
      gap={16}
      renderItem={(item) => (
        <div>
          <button
            type="button"
            onClick={() => {
              setSelectedImage(item);
              client.trackView(item.id);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: 0,
              border: 0,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              client.trackDownload(item.id);
            }}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Download
          </button>
        </div>
      )}
    />
  </>
)}
      {videos.length > 0 && (
        <section style={{ marginTop: "40px" }}>
          <h2>Videos</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}
          >
            {videos.map((video) => {
              const videoFile = video.videoFiles
                .filter((file) => file.fileType === "video/mp4")
                .sort((a, b) => {
                  const aWidth = a.width || 0;
                  const bWidth = b.width || 0;

                  return bWidth - aWidth;
                })[0];

              if (!videoFile) {
                return null;
              }

              return (
                <article
                  key={video.id}
                  style={{
                    position: "relative",
                    width: "360px",
                    maxWidth: "100%",
                    height: "640px",
                    overflow: "hidden",
                    borderRadius: "12px",
                    background: "#000",
                  }}
                >
                  <VideoPlayer
                    src={videoFile.link}
                    poster={video.image}
                    controls
                    muted
                    width="100%"
                    height="100%"
                    onPlay={() => client.trackView(video.id)}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: "16px",
                      bottom: "16px",
                      color: "#fff",
                      background: "rgba(0, 0, 0, 0.5)",
                      padding: "8px 12px",
                      borderRadius: "8px",
                    }}
                  >
                    Video by {video.userName}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {selectedImage && (
        <Lightbox
          open={true}
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </main>
  );
}

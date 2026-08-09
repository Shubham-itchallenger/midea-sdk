import { useEffect, useMemo, useState } from "react";
import type { MediaAsset } from "@media/media-react";
import { useMedia, useMediaSearch } from "@media/media-react";
import { Lightbox, MediaGrid, ReelSwiper, type ReelItem } from "@media/media-ui-react";
import "./App.css";

export default function App() {
  const client = useMedia();
  const [query, setQuery] = useState("mountains");
  const [page, setPage] = useState(1);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt?: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { data, loading, error } = useMediaSearch({ query, page, perPage: 20 });

  useEffect(() => {
    if (!data) return;
    setAssets((previous) => page === 1
      ? data.assets
      : [...previous, ...data.assets.filter((asset) => !previous.some((existing) => existing.id === asset.id && existing.type === asset.type))]);
  }, [data, page]);

  useEffect(() => {
    const stopView = client.onView((event) => console.info("Media viewed:", event));
    const stopDownload = client.onDownload((event) => console.info("Media downloaded:", event));
    return () => { stopView(); stopDownload(); };
  }, [client]);

  const photos = assets.filter((asset) => asset.type === "photo").map((asset) => ({
    id: asset.id, src: asset.thumbnailUrl, downloadUrl: asset.imageUrl, alt: `Photo by ${asset.photographer}`,
  }));
  const reelItems = useMemo<ReelItem[]>(() => assets.filter((asset) => asset.type === "video").flatMap((video) => {
    const file = video.videoFiles.filter((candidate) => candidate.fileType === "video/mp4").sort((a, b) => b.width - a.width)[0];
    return file ? [{ id: video.id, src: file.link, poster: video.image, label: `Video by ${video.userName}` }] : [];
  }), [assets]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setAssets([]);
  }

  async function downloadImage(id: string, url: string) {
    setDownloadingId(id);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Image download failed");
      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `pexels-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
      client.trackDownload(id);
    } catch {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      client.trackDownload(id);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">HEADLESS MEDIA SDK</p>
        <h1 id="page-title">Find visual stories<br /><em>worth sharing.</em></h1>
        <p className="hero-copy">Explore curated photography and short-form video, powered by Pexels.</p>
        <form className="search-form" onSubmit={submitSearch}>
          <label className="sr-only" htmlFor="media-search">Search media</label>
          <span aria-hidden="true" className="search-icon">⌕</span>
          <input id="media-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “coastal mornings”" />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="content-section" aria-labelledby="photos-heading">
        <div className="section-heading">
          <div><p className="eyebrow">DISCOVER</p><h2 id="photos-heading">Photography</h2></div>
          {photos.length > 0 && <p className="result-count">{photos.length} visual{photos.length === 1 ? "" : "s"} found</p>}
        </div>

        {error && <p className="message message-error" role="alert">{error.message}</p>}
        {loading && photos.length === 0 && <div className="skeleton-grid" aria-label="Loading media"><i /><i /><i /><i /></div>}
        {!loading && !error && photos.length === 0 && <p className="message">No photos found. Try another search.</p>}

        {photos.length > 0 && <MediaGrid
          items={photos}
          className="media-grid"
          hasMore={Boolean(data?.pagination.nextPage)}
          loading={loading}
          onLoadMore={() => setPage((current) => current + 1)}
          renderItem={(item) => <article className="media-card">
            <button className="media-preview" type="button" onClick={() => { setSelectedImage(item); client.trackView(item.id); }}>
              <img src={item.src} alt={item.alt} loading="lazy" />
              <span className="view-label">View image</span>
            </button>
            <div className="card-footer"><span>{item.alt?.replace("Photo by ", "")}</span><button className="download-button" type="button" disabled={downloadingId === item.id} onClick={() => void downloadImage(item.id, item.downloadUrl ?? item.src)}>{downloadingId === item.id ? "Preparing…" : "Download"} <span aria-hidden="true">↗</span></button></div>
          </article>}
        />}
        {loading && photos.length > 0 && <p className="loading-more">Loading more visual stories…</p>}
      </section>

      {reelItems.length > 0 && <section className="content-section reels-section" aria-labelledby="reels-heading">
        <div className="section-heading"><div><p className="eyebrow">MOTION</p><h2 id="reels-heading">Video reels</h2></div><p className="result-count">Scroll to browse</p></div>
        <div className="reel-frame">
          <ReelSwiper items={reelItems} onActiveChange={(id) => client.trackView(id)} renderItem={(item) => <div className="reel-item"><video src={item.src} poster={item.poster} controls muted playsInline /><p>{item.label}</p></div>} />
        </div>
      </section>}

      {selectedImage && <Lightbox open src={selectedImage.src} alt={selectedImage.alt} onClose={() => setSelectedImage(null)} className="lightbox-backdrop" contentClassName="lightbox-content" closeButtonClassName="lightbox-close" />}
    </main>
  );
}

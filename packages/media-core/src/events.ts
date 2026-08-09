export type MediaEventType = "view" | "download";

export interface MediaEvent {
  type: MediaEventType;
  mediaId: string;
  timestamp: number;
}

export type MediaEventListener = (event: MediaEvent) => void;

export class MediaEventEmitter {
  private readonly listeners = new Map<
    MediaEventType,
    Set<MediaEventListener>
  >();

  on(
    type: MediaEventType,
    listener: MediaEventListener,
  ): () => void {
    let listeners = this.listeners.get(type);

    if (!listeners) {
      listeners = new Set();
      this.listeners.set(type, listeners);
    }

    listeners.add(listener);

    return () => {
      listeners?.delete(listener);
    };
  }

  emit(
    type: MediaEventType,
    mediaId: string,
  ): void {
    const event: MediaEvent = {
      type,
      mediaId,
      timestamp: Date.now(),
    };

    this.listeners.get(type)?.forEach((listener) => {
      listener(event);
    });
  }
}
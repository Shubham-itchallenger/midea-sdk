export class MediaError extends Error {
  readonly status?: number;
  readonly code: string;

  constructor(
    message: string,
    options?: {
      code?: string;
      status?: number;
    },
  ) {
    super(message);

    this.name = "MediaError";
    this.code = options?.code ?? "MEDIA_ERROR";
    this.status = options?.status;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
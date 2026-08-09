import type { ReactNode } from "react";

export interface LightboxProps {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
  children?: ReactNode;
}

export function Lightbox({
  open,
  src,
  alt = "",
  onClose,
  children,
}: LightboxProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close media preview"
        onClick={onClose}
      >
        ×
      </button>

      <div onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={alt} />
        {children}
      </div>
    </div>
  );
}
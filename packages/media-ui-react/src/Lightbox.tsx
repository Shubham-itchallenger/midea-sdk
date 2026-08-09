import type { ReactNode } from "react";
import { useLightbox } from "./useLightbox";

export interface LightboxProps {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  closeButtonClassName?: string;
}

export function Lightbox({
  open,
  src,
  alt = "",
  onClose,
  children,
  className,
  contentClassName,
  closeButtonClassName,
}: LightboxProps) {
  const { getDialogProps, getBackdropProps } = useLightbox(open, onClose);
  if (!open) {
    return null;
  }

  return (
    <div
      {...getDialogProps()}
      aria-label="Media preview"
      {...getBackdropProps()}
      className={className}
    >
      <button
        type="button"
        aria-label="Close media preview"
        onClick={onClose}
        className={closeButtonClassName}
      >
        ×
      </button>

      <div className={contentClassName} onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={alt} />
        {children}
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";

export function useLightbox(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [open, onClose]);
  return { getDialogProps: () => ({ ref: dialogRef, role: "dialog" as const, "aria-modal": true, tabIndex: -1 }), getBackdropProps: () => ({ onClick: onClose }) };
}

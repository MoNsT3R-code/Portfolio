import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/** Native modal dialog: focus trap, Escape and inert background come from the browser. */
export function Dialog({
  label,
  onClose,
  className = 'overlay',
  children,
}: {
  label: string;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', onCancel);
    return () => {
      dialog.removeEventListener('cancel', onCancel);
      if (dialog.open) dialog.close();
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={className}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }}
    >
      {children}
    </dialog>
  );
}

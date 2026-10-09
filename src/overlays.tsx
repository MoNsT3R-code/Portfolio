import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

// Ask my portfolio and the command palette load on first use, so they cost nothing on page load.
const Ask = lazy(() => import('./components/Ask'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

type Open = { kind: 'ask'; query: string } | { kind: 'palette' } | null;

interface OverlayValue {
  openAsk: (query?: string) => void;
  openPalette: () => void;
  close: () => void;
}

const OverlayContext = createContext<OverlayValue>({ openAsk: () => {}, openPalette: () => {}, close: () => {} });

export function useOverlays() {
  return useContext(OverlayContext);
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Open>(null);

  const openAsk = useCallback((query = '') => setOpen({ kind: 'ask', query }), []);
  const openPalette = useCallback(() => setOpen({ kind: 'palette' }), []);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => (o?.kind === 'palette' ? null : { kind: 'palette' }));
      } else if (e.key === '/' && !open && !isTyping(e.target)) {
        e.preventDefault();
        setOpen({ kind: 'ask', query: '' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const value = useMemo(() => ({ openAsk, openPalette, close }), [openAsk, openPalette, close]);

  return (
    <OverlayContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        {open?.kind === 'ask' ? <Ask initialQuery={open.query} onClose={close} /> : null}
        {open?.kind === 'palette' ? <CommandPalette onClose={close} /> : null}
      </Suspense>
    </OverlayContext.Provider>
  );
}

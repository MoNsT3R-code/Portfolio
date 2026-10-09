import { useOverlays } from '../overlays';
import { Link } from '../router';
import { Menu } from './Menu';

/** Wordmark (inverts against whatever is behind it), an Ask shortcut and the menu button. */
export function Header() {
  const { openAsk } = useOverlays();
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <a
        href="#main"
        className="sr-only-focusable pointer-events-auto absolute top-3 left-3 z-50 rounded-full bg-[#0d0d0d] px-4 py-2 text-sm font-semibold text-[#f2eee6]"
      >
        Skip to content
      </a>
      <div className="wrap flex items-center justify-between pt-4">
        <Link
          to="/"
          className="pointer-events-auto flex h-14 items-center rounded-full bg-[#0d0d0d] px-5 font-display text-[1.1rem] font-extrabold tracking-[-0.03em] text-[#f2eee6] ring-2 ring-[#f2eee6]/80"
          data-cursor="Home"
        >
          Musfira Sehar<span className="text-coral">.</span>
        </Link>
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => openAsk('')}
            className="hidden h-14 items-center gap-2 rounded-full bg-[#f2eee6] px-5 text-[0.92rem] font-semibold text-[#0d0d0d] ring-2 ring-[#0d0d0d] transition-transform hover:scale-105 sm:flex"
            aria-keyshortcuts="/"
            data-cursor="Ask"
          >
            Ask <kbd>/</kbd>
          </button>
          <Menu />
        </div>
      </div>
    </header>
  );
}

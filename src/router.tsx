import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { flushSync } from 'react-dom';

// A small history router: the site has two route shapes ("/" and "/work/:slug"), so a library isn't needed.

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function withBase(path: string): string {
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  return BASE + (path.startsWith('/') ? path : '/' + path);
}

export function stripBase(pathname: string): string {
  let p = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  if (!p.startsWith('/')) p = '/' + p;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

export function assetUrl(path: string): string {
  return withBase(path.startsWith('/') ? path : '/' + path);
}

interface RouterValue {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterValue>({ path: '/', navigate: () => {} });

function scrollToHash(hash: string) {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    return;
  }
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (el) {
    el.scrollIntoView({ block: 'start' });
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
}

export function RouterProvider({ initialPath, children }: { initialPath: string; children: ReactNode }) {
  const [path, setPath] = useState(() => stripBase(initialPath.split('#')[0].split('?')[0]));
  const pendingHash = useRef<string | null>(null);

  useEffect(() => {
    const onPop = () => setPath(stripBase(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useLayoutEffect(() => {
    if (pendingHash.current !== null) {
      const hash = pendingHash.current;
      pendingHash.current = null;
      scrollToHash(hash);
    }
  }, [path]);

  const navigate = useCallback(
    (to: string) => {
      const [rawPath, rawHash = ''] = to.split('#');
      const nextPath = stripBase(rawPath || path);
      const hash = rawHash ? '#' + rawHash : '';
      const url = withBase(nextPath === '/' ? '/' : nextPath) + hash;

      if (nextPath === path) {
        window.history.pushState(null, '', url);
        scrollToHash(hash);
        return;
      }
      window.history.pushState(null, '', url);
      pendingHash.current = hash;
      const update = () => flushSync(() => setPath(nextPath));
      const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (doc.startViewTransition && !reduce) doc.startViewTransition(update);
      else update();
    },
    [path],
  );

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const external = /^(https?:|mailto:|tel:)/.test(to);
  return (
    <a
      href={external ? to : withBase(to)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || external || rest.target || rest.download !== undefined) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

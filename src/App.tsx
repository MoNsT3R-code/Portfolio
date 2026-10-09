import { Suspense, useEffect } from 'react';
import { projectBySlug } from './content/portfolio';
import { headFor, resolveRoute } from './head';
import { OverlayProvider, useOverlays } from './overlays';
import { Link, RouterProvider, useRouter } from './router';
import { Contact } from './components/Contact';
import { Header } from './components/Header';
import { Cursor, Lines } from './components/kit';
import { About } from './pages/About';
import { Archive } from './pages/Archive';
import { CaseStudy } from './pages/CaseStudy';
import { Home } from './pages/Home';
import { Work } from './pages/Work';

export function App({ initialPath }: { initialPath: string }) {
  return (
    <RouterProvider initialPath={initialPath}>
      <OverlayProvider>
        <Shell />
      </OverlayProvider>
    </RouterProvider>
  );
}

/** Slides content and headings in as they scroll into view. CSS keeps everything visible without JS. */
function useReveal(path: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in), .reveal:not(.is-in)'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
}

function Shell() {
  const { path } = useRouter();
  const route = resolveRoute(path);
  useReveal(path);

  useEffect(() => {
    document.title = headFor(path).title;
  }, [path]);

  let page;
  switch (route.kind) {
    case 'home':
      page = <Home />;
      break;
    case 'work':
      page = <Work />;
      break;
    case 'about':
      page = <About />;
      break;
    case 'archive':
      page = <Archive />;
      break;
    case 'project':
      page = <CaseStudy key={route.slug} project={projectBySlug(route.slug)!} />;
      break;
    default:
      page = <NotFound />;
  }

  return (
    <>
      <Header />
      <Cursor />
      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={null}>{page}</Suspense>
      </main>
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
    </>
  );
}

function NotFound() {
  const { openAsk } = useOverlays();
  return (
    <section aria-labelledby="nf-title" className="tone-ink grid min-h-[80svh] content-center pt-32 pb-20">
      <div className="wrap grid gap-8">
        <p className="kicker text-coral">404 · No grounded answer</p>
        <h1 id="nf-title" className="display d-xl">
          <Lines hero lines={['Lost', <span className="text-coral">in space.</span>]} />
        </h1>
        <p className="lead measure">Nothing on the site matches this address. Head home, or ask the site directly.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="btn btn-solid">
            Go home
          </Link>
          <button type="button" className="btn" onClick={() => openAsk('')}>
            Ask my portfolio <kbd>/</kbd>
          </button>
        </div>
      </div>
    </section>
  );
}

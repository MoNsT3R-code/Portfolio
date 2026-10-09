import { SITE_URL, projectBySlug, projects, site } from './content/portfolio';

export interface Head {
  title: string;
  description: string;
  path: string;
  status: 200 | 404;
}

export type Route =
  | { kind: 'home' }
  | { kind: 'work' }
  | { kind: 'about' }
  | { kind: 'archive' }
  | { kind: 'project'; slug: string }
  | { kind: 'not-found' };

export function resolveRoute(path: string): Route {
  if (path === '/' || path === '') return { kind: 'home' };
  if (path === '/work') return { kind: 'work' };
  if (path === '/about') return { kind: 'about' };
  if (path === '/archive') return { kind: 'archive' };
  const m = path.match(/^\/work\/([a-z0-9-]+)$/);
  if (m && projectBySlug(m[1])) return { kind: 'project', slug: m[1] };
  return { kind: 'not-found' };
}

export function headFor(path: string): Head {
  const route = resolveRoute(path);
  if (route.kind === 'home') return { title: site.title, description: site.description, path: '/', status: 200 };
  if (route.kind === 'work')
    return { title: `Work · ${site.name}`, description: 'Case studies from the AI Team at Stewart, plus personal and university projects.', path: '/work', status: 200 };
  if (route.kind === 'about')
    return { title: `About · ${site.name}`, description: 'Who I am: an AI and security engineer in Lahore, studying computer science at FCCU.', path: '/about', status: 200 };
  if (route.kind === 'archive')
    return { title: `Archive · ${site.name}`, description: 'Every deck, report, video and interactive page behind the projects.', path: '/archive', status: 200 };
  if (route.kind === 'project') {
    const p = projectBySlug(route.slug)!;
    return {
      title: `${p.title} · Case study · ${site.name}`,
      description: stripTodos(p.summary),
      path: `/work/${p.slug}`,
      status: 200,
    };
  }
  return { title: `Not found · ${site.name}`, description: site.description, path, status: 404 };
}

export function stripTodos(s: string): string {
  return s.replace(/\s*\[TODO:[^\]]*\]/g, '').trim();
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Head tags for the prerendered HTML. `base` is the deploy base path, e.g. "/" or "/repo/". */
export function headTags(head: Head, base: string): string {
  const url = SITE_URL.replace(/\/$/, '') + base.replace(/\/$/, '') + (head.path === '/' ? '/' : head.path);
  const image = SITE_URL.replace(/\/$/, '') + base.replace(/\/$/, '') + '/og.png';
  return [
    `<title>${esc(head.title)}</title>`,
    `<meta name="description" content="${esc(head.description)}" />`,
    head.status === 404 ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${head.path.startsWith('/work/') ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(head.title)}" />`,
    `<meta property="og:description" content="${esc(head.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="I build AI that retrieves before it answers and secures before it ships. Musfira Sehar, AI and security engineer." />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ');
}

export const allPaths = ['/', '/work', '/about', '/archive', ...projects.map((p) => `/work/${p.slug}`)];

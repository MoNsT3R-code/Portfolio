// Renders every route to static HTML so pages load complete, without waiting for JavaScript.
// Also writes 404.html and sitemap.xml. Runs after `vite build` and the SSR build.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
let template = readFileSync(join(dist, 'index.html'), 'utf8');
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/);
if (cssLink) {
  const css = readFileSync(join(dist, cssLink[1].replace(base, '')), 'utf8');
  template = template.replace(cssLink[0], `<style>${css}</style>`);
}
const { render, headTags, allPaths, SITE_URL, PUBLISH_HELD, person, projects, sections, site, library, githubProjects, GITHUB } = await import(pathToFileURL(join(root, 'dist-ssr/entry-server.js')).href);

// Preload the two fonts the first screen needs.
const assets = readdirSync(join(dist, 'assets'));
const preloads = ['syne', 'dm-sans']
  .map((name) => assets.find((f) => f.startsWith(name) && f.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="${base}assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');

function write(path, file) {
  const { html, head } = render(path);
  const page = template
    .replace('<!--app-head-->', `${headTags(head, base)}\n    ${preloads}`)
    .replace('<div id="root">', `<div id="root" data-route="${path}">`)
    .replace('<!--app-html-->', html);
  const out = join(dist, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
  console.log('prerendered', path.padEnd(40), '→', file);
}

for (const path of allPaths) write(path, path === '/' ? 'index.html' : `${path.slice(1)}/index.html`);
write('/404', '404.html');

const origin = SITE_URL.replace(/\/$/, '') + base.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  allPaths.map((p) => `  <url><loc>${origin}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  '\n</urlset>\n';
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
console.log('sitemap.xml and robots.txt for', origin);

// llms.txt: a plain-text map of the site for AI tools (https://llmstxt.org)
const clean = (s) => s.replace(/\s*\[TODO:[^\]]*\]/g, '').trim();
const llms = [
  `# ${site.name}`,
  '',
  `> ${site.description}`,
  '',
  `${person.role}, ${person.team}, ${person.company}, ${person.period}. ${person.education.degree}, ${person.education.school} (${person.education.graduation.replace(/^Expected/, 'expected')}).`,
  'Every case study separates problem, approach, what was built, results and what is next, and carries its real status. Team work is credited as team work.',
  '',
  '## Case studies',
  '',
  ...projects.map((p) => `- [${p.title}](${origin}/work/${p.slug}): ${clean(p.summary)} Status: ${p.status.label}.`),
  '',
  '## GitHub projects',
  '',
  ...githubProjects.map((g) => `- [${g.title}](${GITHUB}/${g.repo}): ${g.summary}`),
  '',
  '## Sections',
  '',
  ...[['Work', '/work'], ['About', '/about'], ['Archive', '/archive']].map(([l, h]) => `- [${l}](${origin}${h})`),
  '',
  '## Documents and media',
  '',
  ...library.map((it) => `- [${it.title}](${origin}/${it.file}): ${it.description}`),
  '',
].join('\n');
writeFileSync(join(dist, 'llms.txt'), llms);
console.log('llms.txt');

// Held files (internal or unconfirmed) live in public/library/held/ and never ship unless PUBLISH_HELD is on.
if (!PUBLISH_HELD && existsSync(join(dist, 'library/held'))) {
  rmSync(join(dist, 'library/held'), { recursive: true });
  console.log('held files removed from the build');
}

rmSync(join(root, 'dist-ssr'), { recursive: true, force: true });

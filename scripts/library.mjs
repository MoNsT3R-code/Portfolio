// Imports your documents, decks and videos into the site. Run with `npm run library`.
// Needs Windows with Word and PowerPoint (for .docx/.pptx) and Google Chrome (for thumbnails and Markdown PDFs).
//
// Reads assets-src/library.json, writes files to public/library/ and metadata to src/content/library.generated.json.
// Held items go to public/library/held/ and src/content/library.held.json instead; both are git-ignored.
// Outputs that are newer than their sources are reused, so re-running is quick.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { homedir, tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { marked } from 'marked';
import sharp from 'sharp';
import { chromium } from 'playwright-core';

const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'public/library');
mkdirSync(join(outDir, 'held'), { recursive: true });
// output name inside public/library/: held items get their own folder so they never reach git
const name = (it) => (it.hold ? 'held/' : '') + it.id;
const { items } = JSON.parse(readFileSync(join(root, 'assets-src/library.json'), 'utf8'));
const expand = (p) => (p.startsWith('~') ? join(homedir(), p.slice(1)) : /^[A-Za-z]:|^\//.test(p) ? p : join(root, p));
const fresh = (out, srcs) => existsSync(out) && srcs.every((s) => statSync(s).mtimeMs <= statSync(out).mtimeMs);

const missing = [];
for (const it of items) for (const s of [].concat(it.src)) if (!existsSync(expand(s))) missing.push(`${it.id}: ${s}`);
if (missing.length) {
  console.error('Missing source files:\n  ' + missing.join('\n  '));
  process.exit(1);
}

// 1. Office files -> PDF (one Word session, one PowerPoint session)
const officeJobs = items
  .filter((it) => it.kind === 'docx' || it.kind === 'deck')
  .map((it) => ({ src: expand(it.src), out: join(outDir, `${name(it)}.pdf`), type: it.kind }))
  .filter((j) => !fresh(j.out, [j.src]));
if (officeJobs.length) {
  const jobsFile = join(tmpdir(), 'portfolio-office-jobs.json');
  writeFileSync(jobsFile, JSON.stringify(officeJobs));
  console.log(`Converting ${officeJobs.length} Office file(s) to PDF...`);
  console.log(
    // Passed as an inline command: some managed Windows machines block .ps1 files run from user folders.
    execFileSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-EncodedCommand',
        Buffer.from(`$Jobs = '${jobsFile}'
` + readFileSync(join(root, 'scripts/office-to-pdf.ps1'), 'utf8').replace(/^param\(.*\)$/m, ''), 'utf16le').toString('base64'),
      ],
      { encoding: 'utf8', maxBuffer: 1 << 24 },
    ).trim(),
  );
}

// 2. Plain copies
for (const it of items) {
  const ext = { pdf: '.pdf', html: '.html', video: '.mp4' }[it.kind];
  if (!ext) continue;
  const src = expand(it.src);
  const out = join(outDir, name(it) + ext);
  if (!fresh(out, [src])) copyFileSync(src, out);
}

// 3. A local server so Chrome can load pdf.js and the library files over http
const mime = { '.mjs': 'text/javascript', '.js': 'text/javascript', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.html': 'text/html' };
const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/blank.html') return res.writeHead(200, { 'content-type': 'text/html' }).end('<!doctype html><title>library</title>');
  const file = url.startsWith('/pdfjs/')
    ? join(root, 'node_modules/pdfjs-dist', url.slice(7))
    : url.startsWith('/src/')
      ? expand('~' + url.slice(4))
      : join(outDir, url.slice(1));
  if (!existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': mime[extname(file)] ?? 'application/octet-stream', 'access-control-allow-origin': '*' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const chromePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(
  (p) => p && existsSync(p),
);
const browser = await chromium.launch({ executablePath: chromePath });
const page = await browser.newPage();

// 4. Markdown -> PDF
const printCss = `
  body { font: 11pt/1.55 "Segoe UI", system-ui, sans-serif; color: #1a1d26; margin: 0; }
  h1 { font-size: 22pt; line-height: 1.15; margin: 0 0 12pt; } h2 { font-size: 15pt; margin: 20pt 0 8pt; } h3 { font-size: 12pt; margin: 14pt 0 6pt; }
  table { border-collapse: collapse; width: 100%; font-size: 9.5pt; margin: 8pt 0; } th, td { border: 1px solid #d5d9e0; padding: 4pt 6pt; text-align: left; vertical-align: top; }
  th { background: #f2f4f7; } code { font: 9pt Consolas, monospace; background: #f2f4f7; padding: 0 3pt; border-radius: 3px; }
  pre { background: #f2f4f7; padding: 8pt; border-radius: 6px; white-space: pre-wrap; } pre code { background: none; padding: 0; }
  blockquote { border-left: 3px solid #f08c00; margin: 8pt 0; padding: 2pt 10pt; color: #4a5060; }
  .doc + .doc { break-before: page; } hr { border: 0; border-top: 1px solid #d5d9e0; }`;
for (const it of items.filter((x) => x.kind === 'md' || x.kind === 'md-pack')) {
  const srcs = [].concat(it.src).map(expand);
  const out = join(outDir, `${name(it)}.pdf`);
  if (fresh(out, srcs)) continue;
  const body = srcs.map((s) => `<section class="doc">${marked.parse(readFileSync(s, 'utf8'))}</section>`).join('');
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${printCss}</style>${body}`);
  await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' } });
  console.log('ok   ' + out);
}

// 5. Thumbnails, page counts and video metadata, rendered in Chrome
await page.goto(base + '/blank.html', { waitUntil: 'load' });
await page.setContent(`<!doctype html><body><script type="module">
  import * as pdfjs from '${base}/pdfjs/build/pdf.min.mjs';
  pdfjs.GlobalWorkerOptions.workerSrc = '${base}/pdfjs/build/pdf.worker.min.mjs';
  window.pdfThumb = async (url, width) => {
    const doc = await pdfjs.getDocument({ url }).promise;
    const pg = await doc.getPage(1);
    const v1 = pg.getViewport({ scale: 1 });
    const vp = pg.getViewport({ scale: width / v1.width });
    const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
    await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    return { pages: doc.numPages, png: c.toDataURL('image/png') };
  };
  window.videoFrame = (url, at) => new Promise((ok, fail) => {
    const v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.crossOrigin = 'anonymous'; v.src = url;
    v.style.cssText = 'position:fixed;left:0;top:0;width:320px'; document.body.append(v);
    v.onloadedmetadata = () => { v.currentTime = v.duration * at; };
    // wait for the seeked frame to actually be presented before drawing it
    let done = false;
    const grab = () => { if (done) return; done = true; const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
      c.getContext('2d').drawImage(v, 0, 0); v.remove(); ok({ duration: v.duration, w: v.videoWidth, h: v.videoHeight, png: c.toDataURL('image/png') }); };
    v.onseeked = () => { v.requestVideoFrameCallback(grab); setTimeout(grab, 800); };
    v.onerror = () => fail('video error'); setTimeout(() => fail('timeout'), 20000);
  });
  window.ready = true;
</script>`);
await page.waitForFunction(() => window.ready === true);
const toWebp = async (dataUrl, out, width) =>
  sharp(Buffer.from(dataUrl.split(',')[1], 'base64')).resize({ width, withoutEnlargement: true }).webp({ quality: 70 }).toFile(out);

const meta = [];
for (const it of items) {
  const m = { id: it.id, project: it.project, title: it.title, description: it.description, ...(it.hold ? { hold: it.hold } : {}) };
  if (it.kind === 'video') {
    const f = await page.evaluate(([u]) => window.videoFrame(u, 0.2), [`${base}/${name(it)}.mp4`]);
    await toWebp(f.png, join(outDir, `${name(it)}-poster.webp`), 960);
    Object.assign(m, { type: 'video', file: `library/${name(it)}.mp4`, poster: `library/${name(it)}-poster.webp`, duration: Math.round(f.duration), width: f.w, height: f.h });
  } else if (it.kind === 'image') {
    const img = sharp(expand(it.src));
    const { width, height } = await img.metadata();
    await img.resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(outDir, `${name(it)}.webp`));
    Object.assign(m, { type: 'image', file: `library/${name(it)}.webp`, thumb: `library/${name(it)}.webp`, width, height });
  } else if (it.kind === 'html') {
    Object.assign(m, { type: 'interactive', file: `library/${name(it)}.html` });
  } else {
    const t = await page.evaluate(([u]) => window.pdfThumb(u, 960), [`${base}/${name(it)}.pdf`]);
    await toWebp(t.png, join(outDir, `${name(it)}-thumb.webp`), 480);
    const type = it.kind === 'deck' ? 'deck' : 'document';
    Object.assign(m, { type, file: `library/${name(it)}.pdf`, thumb: `library/${name(it)}-thumb.webp`, pages: t.pages });
  }
  m.bytes = statSync(join(root, 'public', m.file)).size;
  meta.push(m);
  console.log(`meta ${m.type.padEnd(11)} ${name(it)}${m.pages ? ` (${m.pages} p)` : ''}${m.duration ? ` (${m.duration}s)` : ''}`);
}
await browser.close();
server.close();

const published = meta.filter((m) => !m.hold);
const held = meta.filter((m) => m.hold);
writeFileSync(join(root, 'src/content/library.generated.json'), JSON.stringify(published, null, 2) + '\n');
writeFileSync(join(root, 'src/content/library.held.json'), JSON.stringify(held, null, 2) + '\n');
console.log(`\n${published.length} items → src/content/library.generated.json, ${held.length} held → src/content/library.held.json`);

// remove files left over from items that were taken out of library.json
const keepFiles = new Set(meta.flatMap((m) => [m.file, m.thumb, m.poster].filter(Boolean).map((f) => f.replace('library/', ''))));
for (const dir of ['', 'held/']) {
  for (const f of readdirSync(join(outDir, dir))) {
    if ((dir === '' && f === 'held') || keepFiles.has(dir + f)) continue;
    rmSync(join(outDir, dir, f));
    console.log('removed ' + dir + f);
  }
}

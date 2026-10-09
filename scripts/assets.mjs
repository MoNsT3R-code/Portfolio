// One-off asset pipeline. Run with `npm run assets` after changing the certificate or the OG design.
// - copies the Latin subsets of the self-hosted fonts into src/assets/fonts
// - crops the letterboxing off the certificate source and writes WebP versions
// - renders favicons and the Open Graph image
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import subsetFont from 'subset-font';

const root = resolve(import.meta.dirname, '..');
const nm = (p) => join(root, 'node_modules', p);

// Each font is subset to the characters the site uses and limited to the weights in use.
const fonts = {
  'syne.woff2': ['@fontsource-variable/syne/files/syne-latin-wght-normal.woff2', { wght: { min: 500, max: 800 } }],
  'dm-sans.woff2': ['@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2', { wght: { min: 400, max: 700 } }],
};
const chars =
  Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCharCode(0x20 + i)).join('') +
  '’‘“”–—→←↗↑↓⌘·•§×−©éèáàüöñçí…';
mkdirSync(join(root, 'src/assets/fonts'), { recursive: true });
for (const [out, [src, axes]] of Object.entries(fonts)) {
  const buf = await subsetFont(readFileSync(nm(src)), chars, { targetFormat: 'woff2', ...(axes ? { variationAxes: axes } : {}) });
  writeFileSync(join(root, 'src/assets/fonts', out), buf);
  console.log('font', out, buf.length, 'bytes');
}

// certificate: find the non-black content box, crop, export
const certSrc = join(root, 'assets-src/certificate-source.png');
const { data, info } = await sharp(certSrc).removeAlpha().raw().toBuffer({ resolveWithObject: true });
let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
for (let y = 0; y < info.height; y++)
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 3;
    if (data[i] + data[i + 1] + data[i + 2] > 30) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
  }
const box = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
mkdirSync(join(root, 'public/certificates'), { recursive: true });
await sharp(certSrc).extract(box).webp({ quality: 86 }).toFile(join(root, 'public/certificates/ai-models-openness-recognition.webp'));
await sharp(certSrc).extract(box).resize({ width: 960 }).webp({ quality: 80 }).toFile(join(root, 'public/certificates/ai-models-openness-recognition-960.webp'));
await sharp(certSrc).extract(box).resize({ width: 640 }).webp({ quality: 78 }).toFile(join(root, 'public/certificates/ai-models-openness-recognition-640.webp'));
console.log('certificate', box);

// favicons
const favicon = join(root, 'public/favicon.svg');
await sharp(favicon, { density: 600 }).resize(32, 32).png().toFile(join(root, 'public/favicon-32.png'));
await sharp(favicon, { density: 1200 }).resize(180, 180).flatten({ background: '#121413' }).png().toFile(join(root, 'public/apple-touch-icon.png'));
console.log('favicons');

// Open Graph image: rendered by headless Chrome so it uses the real fonts
const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);
const chrome = chromeCandidates.find((p) => existsSync(p));
if (!chrome) {
  console.log('No Chrome found; skipped og.png. Set CHROME_PATH to render it.');
} else {
  const f = (n) => pathToFileURL(join(root, 'src/assets/fonts', n)).href;
  const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(${f('syne.woff2')});font-weight:500 800}
@font-face{font-family:D;src:url(${f('dm-sans.woff2')});font-weight:400 700}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#F2EEE6;color:#0D0D0D;font-family:D;position:relative;overflow:hidden;padding:70px 80px;display:flex;flex-direction:column;justify-content:space-between}
.k{font:600 22px D;letter-spacing:.08em;text-transform:uppercase}
h1{font:800 150px/.86 S;letter-spacing:-.04em}
.c{position:absolute;right:-90px;bottom:-120px;width:520px;height:520px;border-radius:50%;background:#FF5B2E}
p{font:500 30px D;max-width:760px;position:relative}
</style><body><div class="c"></div><div class="k">AI &amp; security engineer · Lahore</div><h1>Musfira<br>Sehar</h1><p>Securing the architecture, line by line. RAG, agents and AI security.</p></body>`;
  const tmp = join(tmpdir(), 'og-render.html');
  writeFileSync(tmp, html);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${join(root, 'public/og.png')}`, pathToFileURL(tmp).href], { stdio: 'ignore' });
  const meta = await sharp(join(root, 'public/og.png')).metadata();
  console.log('og.png', meta.width + 'x' + meta.height);
}

# Musfira Sehar · Portfolio (v2, "studio" edition)

A second design of the same portfolio, inspired by playful creative-developer sites: bold cream, black and coral colour blocks, a hamburger menu that opens full-screen with a circular reveal, line-by-line text reveals, parallax, a cursor follower, a marquee, and a clean project list where each row fills with coral and floats a preview. Pages: Home, Work (`/work`), a detailed page per project (`/work/<slug>`), About (`/about`) and Archive (`/archive`, every document and video). **Ask my portfolio** (BM25 retrieval in the browser, no LLM) is on every page.

Content, documents and scripts are the same as the sky edition in `../musfira-portfolio`; the two folders are independent copies.

## Editing content

- **Text:** everything lives in [`src/content/portfolio.ts`](src/content/portfolio.ts). Components only render it.
- **Placeholders:** missing facts are written as `[TODO: …]` and show on the page as dashed boxes. `npm run todos` lists them.
- **Claude certificates:** `credentials` in the content file. Add `date`, `credentialId` and `url` (LinkedIn's "Show credential" link) and they appear on the certificate cards.
- **GitHub projects:** `githubProjects` and `githubCoursework` in the content file. Facts come from each repository's README.
- **About highlights:** wrap a phrase in `**double asterisks**` in `about.paragraphs` to highlight it in orange.

## Documents, decks and videos

The library is built from your own files by `npm run library`. It needs Windows with Word and PowerPoint, and Google Chrome.

1. Add an entry to [`assets-src/library.json`](assets-src/library.json): `id`, `project` (a project slug, or `research`), `kind` (`pdf`, `docx`, `deck`, `md`, `md-pack`, `html`, `video` or `image`), `title`, `description` and `src`. A `src` path starting with `~` is in your user folder.
2. Run `npm run library`. Word and PowerPoint files become PDFs, Markdown is rendered to PDF, and thumbnails, page counts, video posters and durations are generated. Output goes to `public/library/` and `src/content/library.generated.json`; held items go to `public/library/held/` and `src/content/library.held.json`.

When you replace a file or drop an entry, rerun the script: outputs that no longer belong to any entry are deleted.

### Held files

Some files carry `"hold": "internal"` (they name Stewart systems, show company branding or a confidentiality label) or `"hold": "authorship"` (I couldn't confirm you made them). Held files:

- show on `npm run dev` (localhost) with a "Held" badge,
- are left out of `npm run build`: their cards and metadata aren't bundled, and the files are deleted from `dist/`,
- never reach git: `public/library/held/`, `src/content/library.held.json` and `assets-src/` (your original files and their local paths) are git-ignored, so they exist only on the computer that ran `npm run library`.

Once you have approval to publish them, set `PUBLISH_HELD = true` in `src/content/portfolio.ts`, or remove `hold` from individual entries.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload (shows held files) |
| `npm run build` | Type-check, build, prerender every page to static HTML, write `404.html`, `sitemap.xml`, `robots.txt` and `llms.txt`, and strip held files |
| `npm run preview` | Serve the production build locally |
| `npm test` | BM25 retrieval tests |
| `npm run todos` | List remaining `[TODO: …]` placeholders |
| `npm run library` | Import documents, decks and videos (see above) |
| `npm run assets` | Rebuild fonts (subset), certificate images, favicons and the Open Graph image |

## Deploying

**Vercel:** import the repo. Use the Vite preset, the build command `npm run build` and the output directory `dist`. `vercel.json` adds long-term caching for hashed assets.

**GitHub Pages (project site):** `BASE_PATH=/your-repo-name/ npm run build`, then publish `dist`.

The videos add about 60 MB. That's fine on Vercel. If you deploy through a GitHub repository, keep each file under 100 MB.

## How it's built

- **Pages:** a small history router, with every route prerendered to real HTML by `scripts/prerender.mjs`.
- **Motion:** the projects section pins and moves sideways on screens 768px and wider; the journey chapters pin over a canvas particle galaxy. Phones and anyone with reduced motion get plain, swipeable or stacked layouts.
- **Themes:** day and night, following the system setting until the visitor clicks the sun, the moon, or the theme button.
- **Fonts:** Space Grotesk (headings) and Outfit (text), self-hosted and subset to 37 KB total.
- **Accessibility:** skip link, visible focus, native modal dialogs, `inert` on hidden chapters, status shown by words and border style, and reveals that slide without fading so text never drops below AA contrast.

## Lighthouse (local production build, October 2026)

| Page | Performance | Accessibility | Best practices | SEO | Agentic browsing |
| --- | --- | --- | --- | --- | --- |
| Home, mobile | 96–98 | 100 | 100 | 100 | 100 |
| Home, desktop | 100 | 100 | 100 | 100 | 100 |
| Case study, mobile | 99 | 100 | 100 | 100 | 100 |
| Case study, desktop | 100 | 100 | 100 | 100 | 100 |

Reports are in `lighthouse/`, and screenshots at 375, 768 and 1440 px in both themes are in `screenshots/`. Neither folder is committed.

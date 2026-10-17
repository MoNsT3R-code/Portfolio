# Musfira Sehar · Portfolio (v2, "Studio" Edition)

A second design of my portfolio, inspired by playful creative-developer sites. It uses bold cream, black and coral colour blocks, a full-screen menu with a circular reveal, line-by-line text animation, parallax, a cursor follower, and a clean project list that fills with coral and shows a preview on hover.

![Format](https://img.shields.io/badge/Build-Vite%20%2B%20React%20%2B%20TypeScript-646CFF?logo=vite&logoColor=white)
![Search](https://img.shields.io/badge/Search-BM25%20in--browser-c49a2c)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%20AA-0f1c42)
![Lighthouse](https://img.shields.io/badge/Lighthouse-96%E2%80%93100-brightgreen)
![Install](https://img.shields.io/badge/Backend-None-brightgreen)
![License](https://img.shields.io/badge/License-Not%20yet%20chosen-lightgrey)

---

## 🌐 Overview

This is the "Studio" edition of my portfolio. It has five pages: Home, Work, a detailed page for each project, About and Archive. The Archive holds every document and video. **Ask my portfolio** is available on every page. It uses BM25 retrieval in the browser, so no language model or server is needed.

The content, documents and scripts match the "Sky" edition in `../musfira-portfolio`. The two folders are independent copies.

---

## 📍 Quick Navigation

* [🌐 Overview](#-overview)
* [✨ Key Features](#-key-features)
* [🗺️ Pages](#️-pages)
* [✏️ Editing Content](#️-editing-content)
* [📚 Documents, Decks and Videos](#-documents-decks-and-videos)
* [🔒 Held Files](#-held-files)
* [🧪 Commands](#-commands)
* [🚀 Deploying](#-deploying)
* [🏗️ How It's Built](#️-how-its-built)
* [📊 Lighthouse Results](#-lighthouse-results)
* [📁 Repository Structure](#-repository-structure)
* [📄 License](#-license)

---

## ✨ Key Features

✅ **Studio design** - Cream, black and coral colour blocks with bold typography.

✅ **Full-screen menu** - Opens with a circular reveal.

✅ **Motion** - Line-by-line text reveals, parallax, a cursor follower and a scrolling marquee.

✅ **Project list** - Each row fills with coral and floats a preview as you hover.

✅ **Ask my portfolio** - Searches the site content in the browser with BM25.

✅ **Day and night themes** - Follows the system setting until the visitor chooses one.

✅ **Accessible** - Skip link, visible focus, native modal dialogs, and text that stays above AA contrast.

---

## 🗺️ Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/work` | All projects |
| `/work/<slug>` | Detailed case study for each project |
| `/about` | About me |
| `/archive` | Every document and video |

---

## ✏️ Editing Content

| What | Where |
| --- | --- |
| **Text** | `src/content/portfolio.ts`. Components only render this file. |
| **Placeholders** | Missing facts are written as `[TODO: …]` and appear as dashed boxes on the page. Run `npm run todos` to list them. |
| **Claude certificates** | The `credentials` list in the content file. Add `date`, `credentialId` and `url` to show them on the certificate cards. |
| **GitHub projects** | `githubProjects` and `githubCoursework` in the content file. Facts come from each repository's README. |
| **About highlights** | Wrap a phrase in `**double asterisks**` in `about.paragraphs` to highlight it in orange. |

---

## 📚 Documents, Decks and Videos

The library is built from my own files by `npm run library`. This step needs Windows with Microsoft Word, Microsoft PowerPoint and Google Chrome.

1. Add an entry to `assets-src/library.json` with `id`, `project`, `kind`, `title`, `description` and `src`.
   - `project` is a project slug, or `research`.
   - `kind` is one of `pdf`, `docx`, `deck`, `md`, `md-pack`, `html`, `video` or `image`.
   - A `src` path that starts with `~` is relative to the user folder.
2. Run `npm run library`. Word and PowerPoint files become PDFs, Markdown is rendered to PDF, and thumbnails, page counts, video posters and durations are generated. Output goes to `public/library/` and `src/content/library.generated.json`.

After replacing a file or removing an entry, rerun the script. Outputs that no longer belong to any entry are deleted automatically.

---

## 🔒 Held Files

Some files are held back from publishing for one of two reasons:
- `"hold": "internal"` marks files that name internal systems, show company branding or carry a confidentiality label.
- `"hold": "authorship"` marks files whose authorship I have not yet confirmed.

How held files behave:
- **Development:** They appear on `npm run dev` with a "Held" badge.
- **Build:** They are left out of `npm run build`. Their cards and metadata are not bundled, and the files are removed from `dist/`.
- **Git:** They never reach the repository. `public/library/held/`, `src/content/library.held.json` and `assets-src/` are git-ignored, so they exist only on the machine that ran `npm run library`.

When a file is approved for publication, set `PUBLISH_HELD = true` in `src/content/portfolio.ts`, or remove `hold` from that entry.

---

## 🧪 Commands

| Command | What It Does |
| --- | --- |
| `npm run dev` | Development server with hot reload. Shows held files. |
| `npm run build` | Type-checks, builds, prerenders every page to static HTML, and writes `404.html`, `sitemap.xml`, `robots.txt` and `llms.txt`. Held files are removed. |
| `npm run preview` | Serves the production build locally. |
| `npm test` | Runs the BM25 retrieval tests. |
| `npm run todos` | Lists remaining `[TODO: …]` placeholders. |
| `npm run library` | Imports documents, decks and videos. |
| `npm run assets` | Rebuilds the subset fonts, certificate images, favicons and the Open Graph image. |

---

## 🚀 Deploying

**Vercel:** Import the repository, then use the Vite preset with the build command `npm run build` and the output directory `dist`. `vercel.json` adds long-term caching for hashed assets.

**GitHub Pages (project site):** Run `BASE_PATH=/your-repo-name/ npm run build`, then publish the `dist` folder.

The videos add about 60 MB. That is fine on Vercel. If you deploy through a GitHub repository, keep each file under 100 MB.

---

## 🏗️ How It's Built

- **Routing:** A small history router, with every route prerendered to static HTML by `scripts/prerender.mjs`.
- **Motion:** On screens 768px and wider, the projects section pins and scrolls sideways, and the journey chapters pin over a canvas particle galaxy. Phones and visitors who prefer reduced motion get plain, swipeable or stacked layouts.
- **Themes:** Day and night, following the system setting until the visitor clicks the sun, the moon or the theme button.
- **Fonts:** Space Grotesk for headings and Outfit for body text, self-hosted and subset to 37 KB in total.
- **Accessibility:** Skip link, visible focus, native modal dialogs, `inert` on hidden chapters, and status shown by words and border style. Reveal animations slide without fading, so text never drops below AA contrast.

---

## 📊 Lighthouse Results

Measured on a local production build, October 2026.

| Page | Performance | Accessibility | Best Practices | SEO | Agentic Browsing |
| --- | --- | --- | --- | --- | --- |
| Home, mobile | 96–98 | 100 | 100 | 100 | 100 |
| Home, desktop | 100 | 100 | 100 | 100 | 100 |
| Case study, mobile | 99 | 100 | 100 | 100 | 100 |
| Case study, desktop | 100 | 100 | 100 | 100 | 100 |

Lighthouse reports are stored in `lighthouse/`, and screenshots at 375, 768 and 1440 px in both themes are stored in `screenshots/`. Neither folder is committed.

---

## 📁 Repository Structure

* **`src/content/portfolio.ts`** - All site text and project data.
* **`src/`** - Components, pages and styles.
* **`scripts/`** - Prerendering, library import and asset generation.
* **`assets-src/`** - Source files for the library (git-ignored).
* **`public/`** - Static assets, including the library output.

---

## 📄 License

No license has been chosen for this repository yet.

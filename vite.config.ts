import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const publishHeld = /export const PUBLISH_HELD\s*=\s*true/.test(readFileSync('src/content/portfolio.ts', 'utf8'));

/** Keeps held library metadata (titles, descriptions) out of production bundles unless PUBLISH_HELD is on. */
function stripHeld(): Plugin {
  return {
    name: 'strip-held-library',
    apply: 'build',
    enforce: 'pre',
    transform(_code, id) {
      if (!publishHeld && id.endsWith('/library.held.json')) return { code: '[]', map: null };
    },
  };
}

// BASE_PATH lets the same build run on a GitHub Pages project site, e.g. BASE_PATH=/repo-name/
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [stripHeld(), react(), tailwindcss()],
});

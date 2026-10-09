import published from './library.generated.json';
import { PUBLISH_HELD, projects } from './portfolio';

// Documents, decks, videos and interactive pages imported by `npm run library`.
// Edit titles and descriptions in assets-src/library.json, then rerun the script.
// Held items live in library.held.json, which is git-ignored and only exists on the machine that ran the script.

export type LibraryType = 'deck' | 'document' | 'video' | 'interactive' | 'image';

export interface LibraryItem {
  id: string;
  project: string;
  title: string;
  description: string;
  type: LibraryType;
  file: string;
  thumb?: string;
  poster?: string;
  pages?: number;
  duration?: number;
  width?: number;
  height?: number;
  bytes: number;
  hold?: 'internal' | 'authorship';
}

/** Held items appear in development only, unless PUBLISH_HELD is switched on. */
export const showHeld = import.meta.env.DEV || PUBLISH_HELD;

// Production builds replace library.held.json with [] unless PUBLISH_HELD is on (see vite.config.ts).
const held = Object.values(import.meta.glob<LibraryItem[]>('./library.held.json', { eager: true, import: 'default' })).flat();

export const library: LibraryItem[] = [...(published as LibraryItem[]), ...(showHeld ? held : [])];

export const typeLabel: Record<LibraryType, string> = {
  deck: 'Deck',
  document: 'Report',
  video: 'Video',
  interactive: 'Interactive',
  image: 'Image',
};

export function itemsFor(project: string) {
  return library.filter((it) => it.project === project);
}

export function projectTitle(slug: string) {
  if (slug === 'research') return 'Research';
  return projects.find((p) => p.slug === slug)?.title ?? slug;
}

export function metaLine(it: LibraryItem) {
  const parts: string[] = [typeLabel[it.type]];
  if (it.pages) parts.push(`${it.pages} ${it.pages === 1 ? 'page' : it.type === 'deck' ? 'slides' : 'pages'}`);
  if (it.duration) parts.push(`${Math.floor(it.duration / 60)}:${String(it.duration % 60).padStart(2, '0')}`);
  parts.push(it.bytes >= 1e6 ? `${(it.bytes / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(it.bytes / 1e3))} KB`);
  return parts.join(' · ');
}

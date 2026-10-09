import { library } from '../content/library';

/** The image that represents a project: its first deck or video, else its first document page. */
export function coverFor(slug: string): string | null {
  const items = library.filter((it) => it.project === slug);
  const pick =
    items.find((it) => it.type === 'video' && it.poster) ??
    items.find((it) => it.type === 'deck' && it.thumb) ??
    items.find((it) => it.thumb);
  return pick ? (pick.poster ?? pick.thumb ?? null) : null;
}

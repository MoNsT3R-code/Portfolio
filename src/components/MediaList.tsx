import { useState } from 'react';
import { metaLine, projectTitle } from '../content/library';
import type { LibraryItem } from '../content/library';
import { assetUrl } from '../router';
import { Dialog } from './Dialog';
import { ArrowUpRight } from './kit';

function Held({ hold }: { hold?: LibraryItem['hold'] }) {
  if (!hold) return null;
  return (
    <span className="held" title="Visible on your computer only. Not included in the published site.">
      {hold === 'internal' ? 'Held · internal' : 'Held · check authorship'}
    </span>
  );
}

/** Documents, decks, videos and pages as clean rows. Videos and images open in place. */
export function MediaList({ items, showProject = true }: { items: LibraryItem[]; showProject?: boolean }) {
  const [open, setOpen] = useState<LibraryItem | null>(null);
  return (
    <>
      <ul className="border-b border-[var(--line)]">
        {items.map((it) => {
          const thumb = it.thumb ?? it.poster;
          const inPlace = it.type === 'video' || it.type === 'image';
          const body = (
            <>
              <span className="relative block aspect-[4/3] w-20 flex-none overflow-hidden rounded-lg bg-[#0d0d0d] sm:w-28">
                {thumb ? (
                  <img src={assetUrl(thumb)} alt="" loading="lazy" decoding="async" fetchPriority="low" width={112} height={84} className="h-full w-full object-cover object-top" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-[0.7rem] font-semibold tracking-[0.1em] text-coral uppercase">Web page</span>
                )}
                {it.type === 'video' ? (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-coral pl-0.5 text-[#0d0d0d]">
                      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 4.5v15L19.5 12 7 4.5Z" fill="currentColor" />
                      </svg>
                    </span>
                  </span>
                ) : null}
              </span>
              <span className="grid min-w-0 flex-1 gap-1">
                {showProject ? <span className="label">{projectTitle(it.project)}</span> : null}
                <span className="font-display text-[clamp(1.1rem,1rem+0.5vw,1.45rem)] leading-tight font-bold">{it.title}</span>
                <span className="muted text-[0.9rem] leading-snug">{it.description}</span>
                <span className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="muted text-[0.8rem]">{metaLine(it)}</span>
                  <Held hold={it.hold} />
                </span>
              </span>
              <span className="hidden flex-none sm:block">
                <ArrowUpRight size={22} />
              </span>
            </>
          );
          return (
            <li key={it.id} className="border-t border-[var(--line)]">
              {inPlace ? (
                <button
                  type="button"
                  onClick={() => setOpen(it)}
                  className="flex w-full items-center gap-4 py-4 text-left transition-transform hover:translate-x-1 sm:gap-6"
                  data-cursor={it.type === 'video' ? 'Play' : 'View'}
                >
                  {body}
                  <span className="sr-only">{it.type === 'video' ? '(plays here)' : '(opens here)'}</span>
                </button>
              ) : (
                <a
                  href={assetUrl(it.file)}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-4 py-4 transition-transform hover:translate-x-1 sm:gap-6"
                  data-cursor="Open"
                >
                  {body}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {open ? (
        <Dialog label={open.title} className="lightbox" onClose={() => setOpen(null)}>
          <div className="grid gap-3 rounded-[1.25rem] bg-[#0d0d0d] p-3 text-[#f2eee6] sm:p-4">
            <div className="flex items-center justify-between gap-4 px-1">
              <p className="font-display font-bold">{open.title}</p>
              <button type="button" className="btn btn-sm" autoFocus onClick={() => setOpen(null)}>
                Close <kbd>Esc</kbd>
              </button>
            </div>
            {open.type === 'video' ? (
              <video
                src={assetUrl(open.file)}
                poster={open.poster ? assetUrl(open.poster) : undefined}
                controls
                autoPlay
                playsInline
                className="block max-h-[calc(96dvh-6rem)] w-[min(90vw,1200px)] rounded-xl bg-black"
              />
            ) : (
              <img
                src={assetUrl(open.file)}
                alt={`${open.title}: ${open.description}`}
                width={open.width}
                height={open.height}
                className="mx-auto block h-auto max-h-[calc(96dvh-6rem)] w-auto max-w-full rounded-xl"
              />
            )}
          </div>
        </Dialog>
      ) : null}
    </>
  );
}

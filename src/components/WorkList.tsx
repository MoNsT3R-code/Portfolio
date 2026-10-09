import { useEffect, useRef, useState } from 'react';
import { coverFor } from '../lib/covers';
import { fitStyle } from '../lib/fit';
import { Link, assetUrl } from '../router';
import { ArrowUpRight } from './kit';
import { Rich, StatusLabel } from './ui';
import type { Status } from '../content/portfolio';

export interface WorkItem {
  key: string;
  title: string;
  kind: string;
  meta: string;
  href: string;
  external?: boolean;
  status?: Status;
  cover?: string | null;
  slug?: string;
}

/**
 * The clean project list: one row per project. On a mouse, a preview of the hovered project
 * floats next to the pointer.
 */
export function WorkList({ items, start = 1 }: { items: WorkItem[]; start?: number }) {
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<WorkItem | null>(null);

  useEffect(() => {
    const el = preview.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.14;
      cy += (y - cy) * 0.14;
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX + 160;
      y = e.clientY;
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cover = active ? (active.cover ?? (active.slug ? coverFor(active.slug) : null)) : null;

  return (
    <div onPointerLeave={() => setActive(null)}>
      <ol className="border-b border-[var(--line)]">
        {items.map((it, i) => {
          const inner = (
            <>
              <span className="text-[0.9rem] font-semibold tabular-nums opacity-80">{String(start + i).padStart(2, '0')}</span>
              <span className="work-title display fit min-w-0 leading-[0.95]" style={fitStyle(it.title, 'clamp(1.45rem, 1.05rem + 2.4vw, 3.4rem)')}>
                {it.title}
              </span>
              <span className="col-start-2 text-[0.95rem] lg:col-start-auto">
                <span className="muted">{it.kind}</span>
              </span>
              <span className="col-start-2 flex flex-wrap items-center gap-3 lg:col-start-auto lg:justify-end">
                {it.status ? <StatusLabel status={it.status} /> : null}
                <span className="muted text-[0.85rem]">
                  <Rich text={it.meta} />
                </span>
                {it.external ? <ArrowUpRight size={16} /> : null}
              </span>
            </>
          );
          return (
            <li key={it.key} onPointerEnter={() => setActive(it)}>
              {it.external ? (
                <a href={it.href} target="_blank" rel="noopener" className="work-row" data-cursor="Code">
                  {inner}
                  <span className="sr-only">(opens on GitHub in a new tab)</span>
                </a>
              ) : (
                <Link to={it.href} className="work-row" data-cursor="View">
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <div ref={preview} className={`preview hidden lg:block ${active ? 'is-on' : ''}`} aria-hidden="true">
        {cover ? (
          <img src={assetUrl(cover)} alt="" className="h-full w-full object-cover object-top" />
        ) : active ? (
          <div className="grid h-full w-full place-items-center bg-[#0d0d0d] p-6 text-center">
            <span className="display text-[1.8rem] text-coral">{active.title}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

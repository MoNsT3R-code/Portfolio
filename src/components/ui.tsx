import type { ReactNode } from 'react';
import type { Block, Status } from '../content/portfolio';

/** Renders content text, styling any [TODO: ...] placeholder so it can't be missed. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[TODO:[^\]]*\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('[TODO:') ? (
          <span key={i} className="todo">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function StatusLabel({ status }: { status: Status }) {
  return (
    <span className={`status status--${status.kind}`}>
      <span className="sr-only">Status: </span>
      {status.label}
    </span>
  );
}

export function SectionHead({
  id,
  marker,
  title,
  intro,
}: {
  id: string;
  marker: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <header className="mb-10 grid max-w-3xl gap-3 md:mb-14">
      <p className="label" aria-hidden="true">
        {marker}
      </p>
      <h2 id={id} className="display d-l">
        {title}
      </h2>
      {intro ? <p className="text-ink-2 measure">{intro}</p> : null}
    </header>
  );
}

export function BlockView({ block }: { block: Block }) {
  return (
    <div className="grid gap-5">
      {block.text?.map((t, i) => (
        <p key={i} className="measure">
          <Rich text={t} />
        </p>
      ))}
      {block.points ? <Points points={block.points} /> : null}
      {block.groups ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {block.groups.map((g) => (
            <div key={g.title} className="grid content-start gap-2 rounded-2xl bg-surface p-4">
              <h3 className="label text-ink">{g.title}</h3>
              <Points points={g.points} small />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Points({ points, small }: { points: string[]; small?: boolean }) {
  return (
    <ul className={`grid gap-2 ${small ? 'text-[0.9375rem]' : ''}`}>
      {points.map((p) => (
        <li key={p} className="measure relative pl-5">
          <span aria-hidden="true" className="absolute top-[0.62em] left-0 h-[7px] w-[7px] rounded-full bg-[linear-gradient(135deg,#f76707,#fab005)]" />
          <Rich text={p} />
        </li>
      ))}
    </ul>
  );
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Seal() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="flex-none">
      <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6" cy="6" r="2" fill="currentColor" />
    </svg>
  );
}

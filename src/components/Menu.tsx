import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { contact, person } from '../content/portfolio';
import { toggleTheme } from '../lib/theme';
import { useOverlays } from '../overlays';
import { Link, useRouter } from '../router';
import { ArrowUpRight, GitHubIcon, LinkedInIcon, LocalTime } from './kit';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/archive', label: 'Archive' },
  { to: '/#contact', label: 'Contact' },
];

/** Hamburger button plus a full-screen menu that opens with a circular reveal from the button. */
export function Menu() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const { openAsk } = useOverlays();
  const { path } = useRouter();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => setOpen(false), [path]);

  const linkedin = contact.links.find((l) => l.label === 'LinkedIn')?.href;
  const github = contact.links.find((l) => l.label === 'GitHub')?.href;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-cursor="Menu"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#0d0d0d] text-[#f2eee6] ring-2 ring-[#f2eee6]/80 transition-transform hover:scale-105"
      >
        <span className="sr-only">Open menu</span>
        <span aria-hidden="true" className="grid gap-1.5">
          <span className="block h-[2px] w-6 bg-current transition-transform group-hover:translate-x-1" />
          <span className="block h-[2px] w-6 bg-current transition-transform group-hover:-translate-x-1" />
        </span>
      </button>

      <dialog
        ref={ref}
        className="menu"
        aria-label="Menu"
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      >
        <div className="wrap flex h-full flex-col py-6">
          <div className="flex items-center justify-between">
            <p className="kicker">{person.name}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              autoFocus
              data-cursor="Close"
              className="grid h-14 w-14 place-items-center rounded-full bg-[#0d0d0d] text-[#f2eee6]"
            >
              <span className="sr-only">Close menu</span>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="grid flex-1 content-center gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <nav aria-label="Main">
              <ul className="grid gap-1">
                {LINKS.map((l, i) => (
                  <li key={l.to} style={{ '--i': i } as CSSProperties}>
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="menu-link display text-[clamp(3rem,1.5rem+7vw,7.5rem)] leading-[0.95] hover:italic"
                      data-cursor="Go"
                      aria-current={path === l.to ? 'page' : undefined}
                    >
                      <span>
                        {l.label}
                        <sup className="ml-2 align-top font-sans text-[0.9rem] font-semibold tracking-normal">0{i + 1}</sup>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="grid gap-6 text-[1.05rem]">
              <div className="grid gap-1">
                <p className="label text-[#3a1408]">Based in</p>
                <p>
                  Lahore, Pakistan · <LocalTime />
                </p>
              </div>
              <div className="grid gap-2">
                <p className="label text-[#3a1408]">Elsewhere</p>
                <div className="flex flex-wrap gap-2">
                  {linkedin ? (
                    <a href={linkedin} target="_blank" rel="me noopener" className="btn btn-solid btn-sm">
                      <LinkedInIcon size={16} /> LinkedIn <ArrowUpRight size={14} />
                    </a>
                  ) : null}
                  {github ? (
                    <a href={github} target="_blank" rel="me noopener" className="btn btn-solid btn-sm">
                      <GitHubIcon size={16} /> GitHub <ArrowUpRight size={14} />
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setOpen(false);
                    openAsk('');
                  }}
                >
                  Ask my portfolio <kbd>/</kbd>
                </button>
                <button type="button" className="btn btn-sm" onClick={toggleTheme}>
                  <span className="theme-light-only">Night mode</span>
                  <span className="theme-dark-only">Day mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useOverlays } from '../overlays';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.6 4.77 6v5.56h-4v-4.93c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62v5.01h-4v-11Z"
      />
    </svg>
  );
}

export function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
      />
    </svg>
  );
}

export function ArrowUpRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** A heading split into lines that slide up out of a mask, one after another. */
export function Lines({ lines, hero = false }: { lines: ReactNode[]; hero?: boolean }) {
  return (
    <span className={hero ? 'hero-lines block' : 'block'}>
      {lines.map((l, i) => (
        <span key={i} className="line" style={{ '--i': i } as CSSProperties}>
          <span>{l}</span>
        </span>
      ))}
    </span>
  );
}

/** Moves an element vertically at a fraction of the scroll speed. */
export function useParallax<T extends HTMLElement>(speed = 0.15) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [speed]);
  return ref;
}

/** An endless strip of words. It flips direction with the scroll direction. */
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      ref.current?.classList.toggle('reverse', y < last);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const run = (
    <div className="flex items-center gap-10 pr-10">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-10">
          <span>{t}</span>
          <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full bg-current" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <p className="sr-only">{items.join(', ')}</p>
      <div ref={ref} className="marquee" aria-hidden="true">
        {run}
        {run}
      </div>
    </div>
  );
}

/** The time in Lahore, filled in after load so server and client HTML match. */
export function LocalTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums">
      <span className="sr-only">Local time in Lahore: </span>
      {time || '--:--'} PKT
    </span>
  );
}

/** A round, slowly spinning badge that opens Ask my portfolio. */
export function AskBadge({ className = '' }: { className?: string }) {
  const { openAsk } = useOverlays();
  const text = 'Ask my portfolio · no LLM, just retrieval · ';
  return (
    <button
      type="button"
      onClick={() => openAsk('')}
      data-cursor="Ask"
      className={`wobble relative grid h-36 w-36 place-items-center rounded-full bg-coral text-[#0d0d0d] sm:h-40 sm:w-40 ${className}`}
    >
      <span className="sr-only">Ask my portfolio</span>
      <svg viewBox="0 0 160 160" className="spin absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id="ask-circle" d="M80 80m-60 0a60 60 0 1 1 120 0a60 60 0 1 1-120 0" />
        </defs>
        <text fontSize="12" fontWeight="600" fill="currentColor" style={{ textTransform: 'uppercase' }}>
          <textPath href="#ask-circle" textLength="372" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M15.5 15.5 20 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** Counts up to a number when it scrolls into view. Server HTML has the final number. */
export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / 1200);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      setN(0);
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

/** A statement whose words light up as it scrolls through the viewport. */
export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('span[data-w]'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.35)));
      const lit = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle('lit', i < lit));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    el.classList.add('scroll-words');
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-w="">
          {w}{' '}
        </span>
      ))}
    </p>
  );
}

/**
 * A coral dot that trails the pointer and grows with a label over anything marked data-cursor.
 * Mouse only; hidden for touch and reduced motion. The real cursor stays visible.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !window.matchMedia('(pointer: fine)').matches) return;
    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      el.classList.add('is-on');
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
      const next = target?.dataset.cursor ?? '';
      el.classList.toggle('is-big', !!next);
      setLabel(next);
    };
    const leave = () => el.classList.remove('is-on');
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      {label}
    </div>
  );
}

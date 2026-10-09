import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { library, projectTitle } from '../content/library';
import { contact, projects } from '../content/portfolio';

const PAGES = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'work', label: 'Work', to: '/work' },
  { id: 'about', label: 'About', to: '/about' },
  { id: 'archive', label: 'Archive: documents & media', to: '/archive' },
  { id: 'credentials', label: 'Claude certificates', to: '/#credentials' },
  { id: 'contact', label: 'Contact', to: '/#contact' },
];
import { setTheme, toggleTheme } from '../lib/theme';
import { useOverlays } from '../overlays';
import { useRouter, withBase } from '../router';
import { Dialog } from './Dialog';
import { SearchIcon } from './ui';

interface Command {
  id: string;
  group: 'Sections' | 'Case studies' | 'Documents' | 'Actions';
  label: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

/** Subsequence match, scored so word starts and contiguous runs rank first. */
function score(text: string, q: string): number {
  if (!q) return 1;
  const t = text.toLowerCase();
  const direct = t.indexOf(q);
  if (direct !== -1) return 100 - direct + (direct === 0 || t[direct - 1] === ' ' ? 20 : 0);
  let ti = 0;
  let s = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return 0;
    s += found === ti ? 3 : 1;
    ti = found + 1;
  }
  return s;
}

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const { navigate } = useRouter();
  const { openAsk } = useOverlays();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (to: string) => () => {
      onClose();
      navigate(to);
    };
    const list: Command[] = [];
    for (const s of PAGES) list.push({ id: `s-${s.id}`, group: 'Sections', label: s.label, run: go(s.to) });
    projects.forEach((p, i) =>
      list.push({
        id: `p-${p.slug}`,
        group: 'Case studies',
        label: p.title,
        hint: String(i + 1).padStart(2, '0'),
        keywords: p.kicker,
        run: go(`/work/${p.slug}`),
      }),
    );
    for (const it of library)
      list.push({
        id: `d-${it.id}`,
        group: 'Documents',
        label: it.title,
        hint: projectTitle(it.project),
        keywords: `${it.type} ${it.description}`,
        run: () => {
          onClose();
          navigate(it.project === 'research' ? '/archive' : `/work/${it.project}#media`);
        },
      });
    list.push(
      { id: 'a-ask', group: 'Actions', label: 'Ask my portfolio', hint: '/', run: () => openAsk('') },
      { id: 'a-theme', group: 'Actions', label: 'Switch light / dark theme', keywords: 'dark mode light mode', run: () => { toggleTheme(); onClose(); } },
      { id: 'a-system', group: 'Actions', label: 'Use system theme', keywords: 'auto', run: () => { setTheme('system'); onClose(); } },
    );
    if (contact.resume.href)
      list.push({
        id: 'a-resume',
        group: 'Actions',
        label: contact.resume.label,
        keywords: 'cv resume',
        run: () => {
          window.location.href = withBase('/' + contact.resume.href);
          onClose();
        },
      });
    return list;
  }, [navigate, onClose, openAsk]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    const ranked = commands
      .map((c) => ({ c, s: Math.max(score(c.label, q), score(c.keywords ?? '', q) * 0.6) }))
      .filter((r) => r.s > 0);
    if (q) ranked.sort((a, b) => b.s - a.s);
    const out = ranked.map((r) => r.c);
    if (q.length > 1)
      out.push({ id: 'ask-q', group: 'Actions', label: `Ask my portfolio: “${query.trim()}”`, run: () => openAsk(query.trim()) });
    return out;
  }, [commands, q, query, openAsk]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const groups = q ? null : (['Sections', 'Case studies', 'Documents', 'Actions'] as const);
  const activeId = results[active] ? `${listId}-${results[active].id}` : undefined;

  const renderItem = (c: Command, i: number) => (
    <li
      key={c.id}
      id={`${listId}-${c.id}`}
      role="option"
      aria-selected={i === active}
      data-index={i}
      onMouseMove={() => setActive(i)}
      onClick={() => c.run()}
      className={`mx-2 flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-[0.9375rem] ${
        i === active ? 'bg-surface text-ink' : 'text-ink'
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className={`h-4 w-[3px] flex-none rounded-full ${i === active ? 'bg-acc' : 'bg-transparent'}`} />
        <span className="truncate">{c.label}</span>
      </span>
      {c.hint ? <span className="max-w-[45%] flex-none truncate text-xs text-ink-2">{c.hint}</span> : null}
    </li>
  );

  return (
    <Dialog label="Command palette" onClose={onClose}>
      <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
        <span className="text-ink-2">
          <SearchIcon />
        </span>
        <label htmlFor={inputId} className="sr-only">
          Jump to a section, case study or action
        </label>
        <input
          id={inputId}
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(results.length - 1, a + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              results[active]?.run();
            }
          }}
          placeholder="Jump to…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-2"
        />
        <kbd>Esc</kbd>
      </div>
      <ul ref={listRef} id={listId} role="listbox" aria-label="Results" className="min-h-0 flex-1 overflow-y-auto py-2">
        {results.length === 0 ? <li className="px-4 py-3 text-sm text-ink-2">No matches.</li> : null}
        {groups
          ? groups.map((g) => {
              const items = results.map((c, i) => [c, i] as const).filter(([c]) => c.group === g);
              return items.length ? (
                <li key={g} role="presentation">
                  <p className="label px-4 pt-3 pb-1" aria-hidden="true">
                    {g}
                  </p>
                  <ul role="group" aria-label={g}>
                    {items.map(([c, i]) => renderItem(c, i))}
                  </ul>
                </li>
              ) : null;
            })
          : results.map((c, i) => renderItem(c, i))}
      </ul>
      <p className="hidden border-t border-rule px-4 py-2 font-mono text-xs text-ink-2 sm:block">
        <kbd>↑</kbd> <kbd>↓</kbd> move · <kbd>Enter</kbd> open · <kbd>/</kbd> ask
      </p>
    </Dialog>
  );
}

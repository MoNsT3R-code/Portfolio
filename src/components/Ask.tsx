import { useDeferredValue, useId, useMemo, useState } from 'react';
import { THRESHOLD, tokenize } from '../lib/bm25';
import type { Hit } from '../lib/bm25';
import { getIndex } from '../lib/searchIndex';
import { Link } from '../router';
import { Dialog } from './Dialog';
import { SearchIcon } from './ui';

const SUGGESTIONS = [
  'What has Musfira built with LangGraph?',
  'Which chunking strategy is the baseline?',
  'How is sensitive data handled?',
  'Who was on the Openness Report team?',
  'What security labs has Musfira done?',
];

/** Wraps words whose stem matched the query in <mark>, so the evidence shows why it was retrieved. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const set = new Set(terms);
  const parts = text.split(/([A-Za-z0-9’']+)/);
  return (
    <>
      {parts.map((part, i) => {
        const t = tokenize(part)[0];
        return t && set.has(t) ? (
          <mark key={i} className="term">
            {part}
          </mark>
        ) : (
          part
        );
      })}
    </>
  );
}

export default function Ask({ initialQuery, onClose }: { initialQuery: string; onClose: () => void }) {
  const [query, setQuery] = useState(initialQuery);
  const deferred = useDeferredValue(query);
  const inputId = useId();
  const index = getIndex();

  const result = useMemo(() => {
    const q = deferred.trim();
    if (q.length < 2) return null;
    const { terms, hits } = index.search(q, 5);
    const unknown = q
      .split(/[^A-Za-z0-9]+/)
      .filter((w) => {
        const t = tokenize(w)[0];
        return t && !index.knows(t);
      });
    const strong = hits.filter((h) => h.score >= THRESHOLD);
    const quoted: Hit[] = [];
    for (const h of strong) {
      if (quoted.length === 2) break;
      if (!quoted.some((x) => x.passage.href === h.passage.href)) quoted.push(h);
    }
    return { q, terms, hits, strong, quoted, unknown };
  }, [deferred, index]);

  const max = result?.hits[0]?.score ?? 1;
  const scale = Math.max(max, THRESHOLD * 1.6);

  return (
    <Dialog label="Ask my portfolio" onClose={onClose}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule px-4 py-3">
        <p className="label text-ink">Ask my portfolio</p>
        <p className="font-mono text-xs text-ink-2">Retrieval, not generation. No LLM, no API calls.</p>
      </div>

      <form
        role="search"
        className="flex items-center gap-3 border-b border-rule px-4 py-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <span className="text-ink-2">
          <SearchIcon />
        </span>
        <label htmlFor={inputId} className="sr-only">
          Ask a question about Musfira’s work
        </label>
        <input
          id={inputId}
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about projects, RAG, security…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-2"
        />
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
          Close <kbd>Esc</kbd>
        </button>
      </form>

      <div className="min-h-0 flex-1 overflow-y-auto bg-surface px-4 py-4" aria-live="polite">
        {!result ? (
          <div className="grid gap-3">
            <p className="text-sm text-ink-2">
              Answers are passages quoted from this site, ranked by BM25. Try one of these:
            </p>
            <ul className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" className="btn btn-ghost btn-sm bg-bg" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : result.quoted.length === 0 ? (
          <div className="grid gap-3">
            <p className="label text-ink">No grounded answer</p>
            <p>Nothing on this site covers that closely enough to quote, so I won’t guess.</p>
            <p className="text-sm text-ink-2">
              Try asking about BreachMirror AI, RAG chunking, AI security or the recognition.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <p className="label">
              {result.unknown.length ? 'Partial match' : 'Answer'} · quoted from {result.quoted.length}{' '}
              {result.quoted.length === 1 ? 'source' : 'sources'}
            </p>
            {result.unknown.length ? (
              <p className="text-sm text-ink-2">
                This site doesn’t mention “{result.unknown.join('”, “')}”, so these are the closest passages.
              </p>
            ) : null}
            {result.quoted.map((h, i) => (
              <figure key={h.passage.id} className="grid gap-2">
                <blockquote className="measure border-l-2 border-ink-3 pl-4 text-[0.98rem] leading-relaxed">
                  <Highlight text={h.passage.text} terms={h.matched} />
                </blockquote>
                <figcaption>
                  <Link
                    to={h.passage.href}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 border border-edge bg-bg px-2 py-1.5 font-mono text-xs text-ink"
                  >
                    <span className="cite cite-inline">{i + 1}</span>
                    {h.passage.source}
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {result && result.hits.length ? (
          <details className="mt-5 border-t border-rule pt-3">
            <summary className="cursor-pointer font-mono text-xs text-ink">Show retrieval</summary>
            <p className="mt-3 font-mono text-xs text-ink-2">
              Query terms after stop-word removal and stemming: {result.terms.join(', ') || 'none'}
            </p>
            <ol className="mt-3 grid gap-2 font-mono text-xs tabular-nums">
              {result.hits.map((h) => {
                const below = h.score < THRESHOLD;
                return (
                  <li
                    key={h.passage.id}
                    className={`grid grid-cols-[minmax(0,1fr)_5rem_2.75rem] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_9rem_2.75rem] ${below ? 'text-ink-2' : ''}`}
                  >
                    <span className="truncate">{h.passage.source}</span>
                    <span className="relative h-2.5 border border-rule bg-bg" aria-hidden="true">
                      <span
                        className={`absolute inset-y-0 left-0 ${below ? 'bg-ink-3' : 'bg-ink'}`}
                        style={{ width: `${Math.min(100, (h.score / scale) * 100)}%` }}
                      />
                      <span
                        className="absolute -inset-y-1 border-l-[1.5px] border-dashed border-edge"
                        style={{ left: `${(THRESHOLD / scale) * 100}%` }}
                      />
                    </span>
                    <span className="text-right">{h.score.toFixed(1)}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-xs text-ink-2">
              Dashed line: the {THRESHOLD} threshold. Passages under it aren’t quoted. BM25 with k1 = 1.2, b = 0.75 over{' '}
              {index.passages.length} passages.
            </p>
          </details>
        ) : null}
      </div>
    </Dialog>
  );
}


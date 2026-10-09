import { useState } from 'react';
import type { FigureKind } from '../content/portfolio';
import { recognition } from '../content/portfolio';
import { fitStyle } from '../lib/fit';
import { assetUrl } from '../router';
import { Dialog } from './Dialog';

function Fig({ n, caption, children }: { n?: number; caption: string; children: React.ReactNode }) {
  return (
    <figure className="grid gap-3">
      <div className="fig-box rounded-2xl bg-surface p-4 sm:p-6">{children}</div>
      <figcaption className="text-sm text-ink-2">
        <span className="label mr-2 text-acc-text">Fig.{n ? ` ${n}` : ''}</span>
        {caption}
      </figcaption>
    </figure>
  );
}

function FlowItem({ title, note, planned }: { title: string; note?: string; planned?: boolean }) {
  return (
    <li className={planned ? 'planned' : undefined}>
      <span className="flow-title fit" style={fitStyle(title, '1.1rem')}>
        {title}
      </span>
      {note ? <span className="flow-note">{note}</span> : null}
      {planned ? <span className="flow-note font-mono text-[0.6875rem] tracking-[0.08em] uppercase">Planned</span> : null}
    </li>
  );
}

export function PipelineFigure() {
  return (
    <Fig caption="BreachMirror AI’s agentic RAG pipeline in LangGraph. Safety guardrails apply across the run.">
      <div className="grid gap-3">
        <p className="font-mono text-xs text-ink-2">Question → </p>
        <ol className="flow flow-row" aria-label="Pipeline stages">
          <FlowItem title="Retrieve" note="BM25Okapi over the handbook policies" />
          <FlowItem title="Draft" note="Reason over the retrieved evidence" />
          <FlowItem title="Evaluate" note="Check the answer’s quality" />
          <FlowItem title="Finalize" note="Return an evidence-backed answer with citations" />
        </ol>
        <p className="rounded-xl border border-dashed border-[#f76707] px-3 py-2 text-center text-xs font-medium">
          Safety guardrails · answers validated before they’re returned · sensitive data redacted
        </p>
        <p className="text-right font-mono text-xs text-ink-2">→ Cited answer</p>
      </div>
    </Fig>
  );
}

export function RolesFigure() {
  const roles = ['Architect', 'Judge', 'Tester', 'Red Team', 'Benchmark Analyst', 'Auditor', 'Refiner'];
  return (
    <Fig caption="The 7-role agent pipeline used to test and improve the Token Optimizer, run for three rounds.">
      <ol className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-2" aria-label="Pipeline roles">
        {roles.map((r, i) => (
          <li key={r} className="rounded-xl border border-rule bg-card px-3 py-2.5">
            <span className="block font-mono text-[0.6875rem] text-ink-2">{String(i + 1).padStart(2, '0')}</span>
            <span className="block text-sm leading-tight font-medium">{r}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 font-mono text-xs text-ink-2">× 3 rounds</p>
    </Fig>
  );
}

export function OwnershipFigure() {
  const models = [
    { title: 'Application-owned', note: 'Today’s default. The app’s own UI renders the agent’s output.' },
    { title: 'Model-owned', note: 'Declarative UI described by the model, as in A2UI and OpenUI.' },
    { title: 'Tool-owned', note: 'UI that arrives with a tool, through MCP Apps.' },
  ];
  return (
    <Fig caption="Three ways to own the interface of an AI app. In practice they’re usually combined.">
      <div className="grid gap-3">
        <ul className="own-grid">
          {models.map((m) => (
            <li key={m.title} className="rounded-xl border border-rule bg-card px-4 py-3">
              <span className="flow-title fit" style={fitStyle(m.title, '1.1rem')}>
                {m.title}
              </span>
              <span className="flow-note">{m.note}</span>
            </li>
          ))}
        </ul>
        <p className="rounded-xl border border-dashed border-[#f76707] px-3 py-2 text-center text-xs font-medium">
          AG-UI keeps the frontend in sync with the running agent: streaming, tool calls, errors
        </p>
      </div>
    </Fig>
  );
}

export function JourneyFigure() {
  return (
    <Fig caption="The participant journey the hub is organized around.">
      <div className="grid gap-3">
        <ol className="flow flow-row flow-5" aria-label="Event phases">
          <FlowItem title="Training" note="Six sessions" />
          <FlowItem title="Registration" note="Individuals or teams" />
          <FlowItem title="Build Day" note="Real business challenges" />
          <FlowItem title="Showcase" note="Short demos to judges" />
          <FlowItem title="Follow-Up" note="Proof of concept and governance review" />
        </ol>
      </div>
    </Fig>
  );
}

export function ChunkingFigure() {
  const core = ['Fixed-Size', 'Recursive', 'Semantic', 'Sliding Window', 'Structure-Based', 'Hierarchical'];
  const advanced = ['Late', 'Contextual', 'Adaptive'];
  return (
    <Fig caption="Strategies tested on policy, legal and technical documents with 29 queries across four categories and PASS/FAIL criteria.">
      <div className="grid gap-4">
        <p className="label">Core strategies</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {core.map((s) => {
            const baseline = s === 'Recursive';
            return (
              <li
                key={s}
                className={`rounded-xl px-3 py-2.5 ${baseline ? 'bg-[linear-gradient(100deg,#f76707,#fab005)] text-[#141a2b]' : 'border border-rule bg-card'}`}
              >
                <span className="block text-sm font-semibold">{s}</span>
                {baseline ? <span className="block text-[0.72rem] font-medium">Baseline · ~512 tokens</span> : null}
              </li>
            );
          })}
        </ul>
        <p className="label">Advanced upgrade paths</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {advanced.map((s) => (
            <li key={s} className="rounded-xl border border-dashed border-ink-3 bg-card px-3 py-2.5 text-sm font-semibold">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </Fig>
  );
}

export function PatternsFigure() {
  const patterns = ['ReAct', 'Reflection', 'Supervisor', 'Planner-Executor', 'RAG Assistant'];
  const modules = ['Pattern Catalog', 'Security Testing Lab', 'Recommendation Engine', 'Multi-Agent Security Simulator'];
  return (
    <Fig caption="Patterns covered by the blueprint, and the modules planned on top of it. Dotted borders mark planned work.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid content-start gap-2">
          <p className="label">Patterns covered</p>
          <ul className="grid gap-2">
            {patterns.map((p) => (
              <li key={p} className="rounded-xl border border-rule bg-card px-3 py-2 text-sm font-medium">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-2">
          <p className="label">Planned modules</p>
          <ul className="grid gap-2">
            {modules.map((m) => (
              <li key={m} className="rounded-xl border border-dotted border-ink-3 bg-card px-3 py-2 text-sm font-medium">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Fig>
  );
}

export function ArchitectureFigure() {
  return (
    <Fig caption="Current services (solid) and planned additions (dotted).">
      <div className="grid gap-3">
        <ol className="flow" aria-label="Request path">
          <FlowItem title="React + Tailwind frontend" />
          <FlowItem title="API gateway" />
          <FlowItem title="Auth service" note="Firebase, Google sign-in" />
        </ol>
        <ul className="grid gap-2 sm:grid-cols-2">
          {['LangGraph agents', 'Redis', 'AWS', 'Runtime file creation and editing'].map((x) => (
            <li key={x} className="rounded-xl border border-dotted border-ink-3 bg-card px-3 py-2 text-sm">
              {x} <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-ink-2 uppercase">· planned</span>
            </li>
          ))}
        </ul>
      </div>
    </Fig>
  );
}

/** The certificate as a mounted exhibit, with an accessible full-size view. */
export function Exhibit({ n = 1, priority = false }: { n?: number; priority?: boolean }) {
  const [open, setOpen] = useState(false);
  const img = recognition.image;
  return (
    <figure className="grid gap-3">
      <div className="mount">
        <img
          src={assetUrl(img.srcSmall)}
          srcSet={`${assetUrl(img.srcTiny)} 640w, ${assetUrl(img.srcSmall)} 960w, ${assetUrl(img.src)} 1360w`}
          sizes="(min-width: 75rem) 52rem, (min-width: 48rem) 60vw, 92vw"
          width={img.width}
          height={img.height}
          alt={img.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="block h-auto w-full cursor-zoom-in"
          onClick={() => setOpen(true)}
        />
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 text-sm opacity-80">
        <span>
          <span className="mr-2 font-display font-semibold">Fig. {n}</span>
          Recognition certificate, {recognition.report}
        </span>
        <button type="button" className="btn btn-glass btn-sm" aria-haspopup="dialog" onClick={() => setOpen(true)}>
          View full size
        </button>
      </figcaption>
      {open ? (
        <Dialog label="Recognition certificate, full size" className="lightbox" onClose={() => setOpen(false)}>
          <div className="grid gap-3 rounded-[1.25rem] bg-page p-3 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="font-display font-semibold">Fig. {n} · Recognition certificate</p>
              <button type="button" className="btn btn-ghost btn-sm" autoFocus onClick={() => setOpen(false)}>
                Close <kbd>Esc</kbd>
              </button>
            </div>
            <img
              src={assetUrl(img.src)}
              width={img.width}
              height={img.height}
              alt={img.alt}
              className="mx-auto block h-auto max-h-[calc(96dvh-6rem)] w-auto max-w-full"
            />
          </div>
        </Dialog>
      ) : null}
    </figure>
  );
}

export function ProjectFigure({ kind }: { kind: FigureKind }) {
  switch (kind) {
    case 'pipeline':
      return <PipelineFigure />;
    case 'roles':
      return <RolesFigure />;
    case 'ownership':
      return <OwnershipFigure />;
    case 'journey':
      return <JourneyFigure />;
    case 'chunking':
      return <ChunkingFigure />;
    case 'patterns':
      return <PatternsFigure />;
    case 'architecture':
      return <ArchitectureFigure />;
    case 'certificate':
      return <Exhibit />;
  }
}

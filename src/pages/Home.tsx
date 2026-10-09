import type { CSSProperties } from 'react';
import { library } from '../content/library';
import { GITHUB, certifications, compliance, credentials, githubProjects, person, projects } from '../content/portfolio';
import { Link } from '../router';
import { AskBadge, CountUp, Lines, Marquee, ScrollWords, useParallax } from '../components/kit';
import { WorkList } from '../components/WorkList';
import type { WorkItem } from '../components/WorkList';

export const caseItems: WorkItem[] = projects.map((p) => ({
  key: p.slug,
  slug: p.slug,
  title: p.title,
  kind: p.kicker,
  meta: p.timeframe,
  href: `/work/${p.slug}`,
  status: p.status,
}));

export const repoItems: WorkItem[] = githubProjects.map((g) => ({
  key: g.repo,
  title: g.title,
  kind: g.stack.slice(0, 3).join(' · '),
  meta: g.live ? 'Live + code' : 'Code',
  href: `${GITHUB}/${g.repo}`,
  external: true,
  cover: null,
}));

function Hero() {
  const sun = useParallax<HTMLDivElement>(-0.25);
  const dot = useParallax<HTMLDivElement>(0.35);
  return (
    <section id="top" aria-labelledby="hero-title" className="tone-paper relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-32 pb-12">
      <div ref={sun} aria-hidden="true" className="absolute -top-[12vw] -right-[14vw] -z-10 h-[52vw] max-h-[44rem] w-[52vw] max-w-[44rem] rounded-full bg-coral" />
      <div ref={dot} aria-hidden="true" className="absolute top-[46%] right-[6%] -z-10 hidden h-14 w-14 rounded-full bg-[#0d0d0d] lg:block" />
      <div className="wrap grid flex-1 content-end gap-8">
        <p className="kicker">
          {person.descriptor} · Lahore, Pakistan
        </p>
        <h1 id="hero-title" className="display d-xl">
          <span className="sr-only">Musfira Sehar, AI and security engineer</span>
          <span aria-hidden="true">
            <Lines hero lines={['Musfira', <>Sehar<span className="text-coral">.</span></>]} />
          </span>
        </h1>
        <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_1fr]">
          <p className="lead measure">
            I build AI that <strong className="font-semibold">retrieves before it answers</strong> and{' '}
            <strong className="font-semibold">secures before it ships</strong>: RAG pipelines, agentic workflows and
            security-aware applications. Most recently on the AI Team at Stewart.
          </p>
          <div className="flex items-end justify-between gap-6 lg:justify-end">
            <Link to="/work" className="btn btn-solid" data-cursor="Work">
              See the work <span aria-hidden="true">↓</span>
            </Link>
            <AskBadge />
          </div>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  const certified = credentials.filter((c) => c.status === 'Completed').length;
  const stats = [
    { n: projects.length, label: 'case studies' },
    { n: library.length, label: 'documents, decks and videos' },
    { n: certified, label: 'Claude certificates' },
    { n: 32, label: 'PortSwigger labs solved' },
  ];
  return (
    <section aria-labelledby="who-title" className="tone-ink relative py-28 md:py-40">
      <div className="wrap grid gap-16">
        <h2 id="who-title" className="kicker text-coral">
          Who I am
        </h2>
        <ScrollWords
          className="display max-w-[24ch] text-[clamp(1.6rem,1rem+2.6vw,3.8rem)] leading-[1.05]"
          text={`I'm a computer science student at FCCU and an AI and security engineer. From July to October 2026 I was a ${person.role} on Stewart's AI Team, where I built a cited, validated RAG policy assistant, evaluated Claude Code skills and researched AI security.`}
        />
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <figure className="grid gap-3 border-l-4 border-coral pl-6">
            <blockquote className="font-display text-[clamp(1.4rem,1.1rem+1vw,2rem)] leading-tight font-bold">
              “Securing the architecture, line by line.”
            </blockquote>
            <figcaption className="muted text-sm">My GitHub bio</figcaption>
          </figure>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="grid content-start gap-1 border-t border-[var(--line)] pt-4">
                <dt className="muted order-2 text-[0.9rem]">{s.label}</dt>
                <dd className="display order-1 text-[clamp(2.4rem,1.6rem+2.4vw,4rem)] text-coral">
                  <CountUp to={s.n} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <Link to="/about" className="btn w-fit" data-cursor="About">
          More about me <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="tone-paper py-24 md:py-32">
      <div className="wrap grid gap-12">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="work-title" className="display d-l reveal">
            <Lines lines={['Selected', 'work']} />
          </h2>
          <p className="muted max-w-sm">
            Case studies from the AI Team, each with the decks, reports and videos behind it.{' '}
            <Link to="/work" className="link" data-cursor="All">
              All {projects.length + githubProjects.length} projects →
            </Link>
          </p>
        </header>
        <WorkList items={caseItems.slice(0, 6)} />
      </div>
    </section>
  );
}

function Band() {
  return (
    <section aria-label="What I work on" className="tone-coral overflow-hidden border-y-2 border-[#0d0d0d] py-6">
      <Marquee
        className="display text-[clamp(2rem,1.4rem+3vw,4.5rem)]"
        items={['RAG pipelines', 'Agentic workflows', 'AI security', 'LangGraph', 'BM25 retrieval', 'Claude Code', 'Prompt-injection defense', 'React + TypeScript']}
      />
    </section>
  );
}

function Certified() {
  return (
    <section id="credentials" aria-labelledby="cred-title" className="tone-ink py-24 md:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="grid content-start gap-5">
          <h2 id="cred-title" className="display reveal text-[clamp(2.2rem,1rem+3vw,4.6rem)]">
            <Lines lines={['Claude', <span className="text-coral">certified</span>]} />
          </h2>
          <p className="muted measure">
            Anthropic courses on Claude Code, agent skills, subagents and the Claude API, plus the compliance training from the
            internship.
          </p>
        </div>
        <div className="grid gap-10">
          <ul className="border-b border-[var(--line)]">
            {credentials.map((c, i) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] py-5" data-reveal style={{ '--i': i } as CSSProperties}>
                <span className="font-display text-[clamp(1.25rem,1rem+1vw,2rem)] leading-tight font-bold">{c.name}</span>
                <span className="flex items-center gap-3 text-sm">
                  <span className="muted">{c.issuer}</span>
                  <span className={`status ${c.status === 'Completed' ? 'status--accepted text-coral' : 'status--in-progress'}`}>{c.status}</span>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener" className="link">
                      Verify
                    </a>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          <div className="grid gap-3 text-[0.95rem]">
            <p className="label">Certificates of completion</p>
            <ul className="flex flex-wrap gap-2">
              {certifications.map((c) => (
                <li key={c.name} className="chip">
                  {c.name} · {c.date}
                </li>
              ))}
            </ul>
            <p className="muted">Compliance training: {compliance.join(' · ')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function OutsideWork() {
  return (
    <section aria-labelledby="gh-title" className="tone-paper py-24 md:py-32">
      <div className="wrap grid gap-12">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="gh-title" className="display d-l reveal">
            <Lines lines={['Built outside', 'work']} />
          </h2>
          <a href={GITHUB} target="_blank" rel="me noopener" className="btn btn-solid" data-cursor="GitHub">
            github.com/MoNsT3R-code <span aria-hidden="true">↗</span>
          </a>
        </header>
        <WorkList items={repoItems} />
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <SelectedWork />
      <Band />
      <Certified />
      <OutsideWork />
    </>
  );
}

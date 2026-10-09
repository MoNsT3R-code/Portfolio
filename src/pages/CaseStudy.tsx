import type { ReactNode } from 'react';
import { itemsFor } from '../content/library';
import { projects } from '../content/portfolio';
import type { Block, Project } from '../content/portfolio';
import { coverFor } from '../lib/covers';
import { fitStyle } from '../lib/fit';
import { Link, assetUrl } from '../router';
import { ProjectFigure } from '../components/Figures';
import { Lines, useParallax } from '../components/kit';
import { MediaList } from '../components/MediaList';
import { MetricsTable } from '../components/MetricsTable';
import { BlockView, Rich, StatusLabel } from '../components/ui';

function Part({ id, n, title, block, lead, children }: { id: string; n: string; title: string; block: Block; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid gap-6 border-t border-[var(--line)] py-12 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-12 md:py-16">
      <h2 id={`${id}-title`} className="grid content-start gap-2 md:sticky md:top-28 md:self-start md:[--col:16rem]">
        <span className="text-[0.9rem] font-semibold text-[var(--accent)]">{n}</span>
        <span className="display fit" style={fitStyle(title, 'clamp(1.8rem, 1.4rem + 1.4vw, 2.6rem)')}>
          {title}
        </span>
      </h2>
      <div className="grid min-w-0 gap-8 text-[1.05rem]">
        {lead}
        <BlockView block={block} />
        {children}
      </div>
    </section>
  );
}

export function CaseStudy({ project }: { project: Project }) {
  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length];
  const files = itemsFor(project.slug);
  const cover = coverFor(project.slug);
  const coverRef = useParallax<HTMLDivElement>(0.08);
  const builtLabel = project.team && project.team.length > 1 ? 'What we built' : 'What I built';

  const meta: { label: string; value: ReactNode }[] = [
    { label: 'Timeframe', value: <Rich text={project.timeframe} /> },
    { label: 'Status', value: <StatusLabel status={project.status} /> },
  ];
  if (project.team) meta.push({ label: 'Team', value: <Rich text={project.team.join(', ')} /> });
  if (project.myPart) meta.push({ label: 'My part', value: <Rich text={project.myPart} /> });
  if (project.builtWith) meta.push({ label: 'Built with', value: project.builtWith.join(', ') });

  return (
    <article aria-labelledby="case-title">
      <header className="tone-paper pt-36 pb-14">
        <div className="wrap grid gap-10">
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/work" className="btn btn-sm" data-cursor="Back">
              ← All work
            </Link>
            <span className="kicker">
              {String(i + 1).padStart(2, '0')} · {project.kicker}
            </span>
          </div>
          <h1 id="case-title" className="display fit max-w-[16ch]" style={fitStyle(project.title, 'clamp(2.8rem, 1.4rem + 6vw, 8rem)')}>
            <Lines hero lines={[project.title]} />
          </h1>
          <p className="lead measure">{project.summary}</p>
          <dl className="grid gap-6 border-t border-[var(--line)] pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label} className="grid content-start gap-1.5">
                <dt className="label">{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="tone-paper overflow-hidden">
        <div className="wrap">
          <div className="relative aspect-[16/8] overflow-hidden rounded-[1.5rem] bg-[#0d0d0d]">
            <div ref={coverRef} className="absolute -inset-y-[12%] inset-x-0">
              {cover ? (
                <img src={assetUrl(cover)} alt="" className="h-full w-full object-cover object-top opacity-90" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-coral">
                  <span className="display text-[clamp(5rem,3rem+12vw,16rem)] text-[#0d0d0d]">{String(i + 1).padStart(2, '0')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tone-paper pt-10 pb-20">
        <div className="wrap">
          <Part id="problem" n="01" title="Problem" block={project.problem} />
          <Part id="approach" n="02" title="Approach" block={project.approach}>
            {project.figure && project.figure !== 'certificate' ? <ProjectFigure kind={project.figure} /> : null}
          </Part>
          <Part id="built" n="03" title={builtLabel} block={project.built}>
            {project.media?.map((m) => (
              <p key={m} className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-5 text-center text-sm">
                <Rich text={m} />
              </p>
            ))}
          </Part>
          <Part
            id="results"
            n="04"
            title="Results"
            block={project.results}
            lead={project.results.metrics ? <MetricsTable metrics={project.results.metrics} /> : null}
          >
            {project.figure === 'certificate' ? (
              <div className="max-w-2xl">
                <ProjectFigure kind="certificate" />
              </div>
            ) : null}
          </Part>
          <Part id="next" n="05" title="What’s next" block={project.next} />
          {files.length ? (
            <section id="media" aria-labelledby="media-title" className="grid gap-6 border-t border-[var(--line)] py-12 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-12 md:py-16">
              <h2 id="media-title" className="grid content-start gap-2">
                <span className="text-[0.9rem] font-semibold text-[var(--accent)]">06</span>
                <span className="display text-[clamp(1.8rem,1.4rem+1.4vw,2.6rem)]">Files</span>
              </h2>
              <MediaList items={files} showProject={false} />
            </section>
          ) : null}
        </div>
      </div>

      <Link to={`/work/${next.slug}`} className="tone-ink group block py-20 md:py-28" data-cursor="Next">
        <span className="wrap grid gap-4">
          <span className="kicker text-coral">Next project</span>
          <span
            className="display fit flex flex-wrap items-baseline gap-x-6 transition-transform duration-500 group-hover:translate-x-4"
            style={fitStyle(next.title, 'clamp(2.4rem, 1.2rem + 6vw, 7rem)')}
          >
            {next.title} <span aria-hidden="true" className="text-coral">→</span>
          </span>
        </span>
      </Link>
    </article>
  );
}

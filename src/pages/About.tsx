import { Fragment } from 'react';
import type { CSSProperties } from 'react';
import { about, fieldNotes, journey, person, practices, projectBySlug, research, skills } from '../content/portfolio';
import { Link } from '../router';
import { Exhibit } from '../components/Figures';
import { Lines } from '../components/kit';
import { Rich } from '../components/ui';

function Highlighted({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') ? (
          <strong key={i} className="font-semibold text-[var(--accent)]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>
            <Rich text={part} />
          </Fragment>
        ),
      )}
    </>
  );
}

export function About() {
  return (
    <>
      <section aria-labelledby="about-title" className="tone-paper pt-36 pb-20">
        <div className="wrap grid gap-12">
          <h1 id="about-title" className="display d-xl">
            <Lines hero lines={['About', <span className="text-coral">me.</span>]} />
          </h1>
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div className="grid gap-6 text-[clamp(1.1rem,1rem+0.4vw,1.3rem)] leading-relaxed">
              {about.paragraphs.map((p, i) => (
                <p key={i} className="measure">
                  <Highlighted text={p} />
                </p>
              ))}
            </div>
            <dl className="grid content-start border-t border-[var(--line)]">
              {about.facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 border-b border-[var(--line)] py-3">
                  <dt className="label pt-1">{f.label}</dt>
                  <dd>
                    <Rich text={f.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="exp-title" className="tone-ink py-24 md:py-32">
        <div className="wrap grid gap-12">
          <h2 id="exp-title" className="display d-l reveal">
            <Lines lines={['Experience', <span className="text-coral">& education</span>]} />
          </h2>
          <ol className="border-b border-[var(--line)]">
            <li className="grid gap-4 border-t border-[var(--line)] py-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
              <p className="muted">{person.period}</p>
              <div className="grid gap-3">
                <h3 className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.2rem)] font-bold">
                  {person.role} · Stewart
                </h3>
                <p className="muted">{person.team}</p>
                <p className="measure">
                  Built and evaluated secure, grounded AI: an agentic RAG policy assistant, Claude Code skill evaluations and AI security
                  research. Focus areas: agentic AI and RAG, AI and web application security, AI model evaluation and deployment, and
                  frontend development.
                </p>
                <Link to="/work" className="link w-fit">
                  The work from the internship →
                </Link>
              </div>
            </li>
            <li className="grid gap-4 border-t border-[var(--line)] py-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
              <p className="muted">{person.education.graduation}</p>
              <div className="grid gap-2">
                <h3 className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.2rem)] font-bold">{person.education.degree}</h3>
                <p className="muted">{person.education.school}</p>
              </div>
            </li>
          </ol>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="grid gap-3">
              <h3 className="kicker text-coral">Recognition</h3>
              <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.2rem)] leading-tight font-bold">
                AI Models Openness Report: reviewed and accepted after two review passes
              </p>
              <p className="muted">Team: Taimoor Nasir, Rabia Adeel, Mudassar Hussain and Musfira Sehar.</p>
            </div>
            <Exhibit />
          </div>
        </div>
      </section>

      <section aria-labelledby="skills-title" className="tone-paper py-24 md:py-32">
        <div className="wrap grid gap-14">
          <h2 id="skills-title" className="display d-l reveal">
            <Lines lines={['What I', <span className="text-[var(--accent)]">work with</span>]} />
          </h2>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="grid content-start gap-4">
              <h3 className="label">Built with</h3>
              <ul className="border-b border-[var(--line)]">
                {skills.builtWith.map((s) => (
                  <li key={s.name} className="flex flex-wrap items-baseline justify-between gap-x-4 border-t border-[var(--line)] py-3">
                    <span className="font-display text-[1.2rem] font-bold">{s.name}</span>
                    <span className="flex flex-wrap gap-x-3 text-sm">
                      {s.usedIn.map((slug) => (
                        <Link key={slug} to={`/work/${slug}`} className="quiet-link muted">
                          {projectBySlug(slug)?.title}
                        </Link>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-4">
              <h3 className="label">Explored and learning</h3>
              <ul className="flex flex-wrap gap-2">
                {skills.explored.map((s) => (
                  <li key={s} className="chip border-dashed">
                    {s}
                  </li>
                ))}
              </ul>
              <h3 className="label mt-6">Research & security</h3>
              <ul className="grid gap-5">
                {research.map((r) => (
                  <li key={r.area} className="grid gap-1 border-t border-[var(--line)] pt-3">
                    <span className="font-display text-[1.2rem] font-bold">{r.area}</span>
                    <span className="muted text-[0.95rem]">{r.items.join(' · ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="notes-title" className="tone-ink py-24 md:py-32">
        <div className="wrap grid gap-12">
          <h2 id="notes-title" className="display d-l reveal">
            <Lines lines={['Field notes', <span className="text-coral">& how I work</span>]} />
          </h2>
          <ul className="grid gap-8 md:grid-cols-2">
            {fieldNotes.map((n, i) => (
              <li key={n.topic} className="grid gap-3 border-t border-[var(--line)] pt-5" data-reveal style={{ '--i': i % 2 } as CSSProperties}>
                <p className="kicker text-coral">{n.topic}</p>
                <blockquote className="font-display text-[clamp(1.3rem,1.1rem+0.8vw,1.8rem)] leading-snug font-bold">“{n.quote.replace(/^“|”$/g, '')}”</blockquote>
              </li>
            ))}
          </ul>
          <ul className="grid gap-8 md:grid-cols-2">
            {practices.map((p) => (
              <li key={p.title} className="grid gap-2 border-t border-[var(--line)] pt-5">
                <h3 className="font-display text-[1.4rem] font-bold">{p.title}</h3>
                <p className="muted">{p.body}</p>
              </li>
            ))}
          </ul>
          <div className="grid gap-4">
            <h3 className="label">Journey</h3>
            <ol className="grid gap-x-8 md:grid-cols-2 lg:grid-cols-4">
              {journey.map((j) => (
                <li key={j.title} className="grid content-start gap-1 border-t-2 border-coral pt-4">
                  <span className="muted text-sm">{j.when}</span>
                  <span className="font-display text-[1.3rem] font-bold">{j.title}</span>
                  <span className="muted text-[0.92rem]">{j.body}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}

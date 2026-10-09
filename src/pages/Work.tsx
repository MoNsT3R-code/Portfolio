import { useState } from 'react';
import { GITHUB, githubCoursework, githubProjects, projects } from '../content/portfolio';
import { Lines } from '../components/kit';
import { WorkList } from '../components/WorkList';
import { caseItems, repoItems } from './Home';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'internship', label: 'AI Team, Stewart' },
  { id: 'personal', label: 'Personal & university' },
] as const;

export function Work() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('all');
  return (
    <>
      <section aria-labelledby="work-page-title" className="tone-paper pt-36 pb-16">
        <div className="wrap grid gap-10">
          <h1 id="work-page-title" className="display d-xl">
            <Lines hero lines={[<>Work<span className="text-coral">.</span></>]} />
          </h1>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="lead measure">
              {projects.length} case studies from the AI Team at Stewart, and {githubProjects.length} personal and university projects
              on GitHub.
            </p>
            <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`btn btn-sm ${tab === t.id ? 'btn-solid' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {tab !== 'personal' ? (
        <section aria-labelledby="cases-title" className="tone-paper pb-20">
          <div className="wrap grid gap-6">
            <h2 id="cases-title" className="label">
              Case studies · AI Team, Stewart
            </h2>
            <WorkList items={caseItems} />
          </div>
        </section>
      ) : null}

      {tab !== 'internship' ? (
        <section aria-labelledby="repos-title" className="tone-ink py-20 md:py-28">
          <div className="wrap grid gap-12">
            <div className="grid gap-6">
              <h2 id="repos-title" className="label">
                Personal & university · GitHub
              </h2>
              <WorkList items={repoItems} start={projects.length + 1} />
            </div>
            <div className="grid gap-4">
              <h3 className="label">Coursework and labs</h3>
              <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {githubCoursework.map((c) => (
                  <li key={c.repo} className="border-t border-[var(--line)]">
                    <a href={`${GITHUB}/${c.repo}`} target="_blank" rel="noopener" className="grid gap-0.5 py-3 hover:text-coral" data-cursor="Code">
                      <span className="font-semibold">{c.title} ↗</span>
                      <span className="muted text-[0.88rem]">{c.summary}</span>
                      <span className="sr-only">(opens on GitHub in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

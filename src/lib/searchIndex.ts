import { library, metaLine, projectTitle } from '../content/library';
import {
  about,
  certifications,
  chapters,
  credentials,
  fieldNotes,
  GITHUB,
  githubCoursework,
  githubProjects,
  hero,
  journey,
  person,
  practices,
  projects,
  recognition,
  research,
  skills,
} from '../content/portfolio';
import type { Block } from '../content/portfolio';
import { stripTodos } from '../head';
import { BM25 } from './bm25';
import type { Passage } from './bm25';

// Turns the content file into short, citable passages. Placeholders and held files are never indexed.

function blockText(b: Block): string[] {
  const out: string[] = [];
  if (b.text) out.push(b.text.join(' '));
  if (b.points) out.push(b.points.map((p) => p.replace(/[.]?$/, '.')).join(' '));
  return out;
}

const plain = (s: string) => stripTodos(s).replace(/\*\*/g, '');

export function buildPassages(): Passage[] {
  const ps: Passage[] = [];
  const pages: Record<string, string> = {
    '/#about': '/about', '/#journey': '/about', '/#knowledge': '/about', '/#research': '/about', '/#notes': '/about',
    '/#practice': '/about', '/#library': '/archive', '/#github': '/work',
  };
  const add = (id: string, source: string, href: string, text: string) => {
    const clean = plain(text);
    if (clean.replace(/[^a-z]/gi, '').length > 12) ps.push({ id, source, href: pages[href] ?? href, text: clean });
  };

  add('positioning', 'Introduction', '/#top', `${person.positioning} ${hero.lede}`);
  add(
    'role',
    'About',
    '/#about',
    `${person.role} at ${person.company}, on the ${person.team}, ${person.period}. ${person.education.degree}, ${person.education.school}, ${person.education.graduation.replace(/^Expected/, 'expected')}.`,
  );
  about.paragraphs.forEach((p, i) => add(`about-${i}`, 'About', '/#about', p));

  add(
    'recognition',
    'Recognition',
    '/#journey',
    `${recognition.title}: ${recognition.report}, ${recognition.outcome.toLowerCase()}. ${recognition.detail} Team: ${recognition.team.join(', ')}. ${recognition.context}`,
  );
  chapters.forEach((c, i) => add(`chapter-${i}`, `Journey · ${c.title}`, '/#journey', `${c.kind}: ${c.title}. ${c.meta}. ${c.body}`));
  credentials.forEach((c, i) =>
    add(
      `credential-${i}`,
      'Claude certificates',
      '/#credentials',
      `${c.name}: ${c.status === 'Completed' ? 'certificate of completion' : 'in progress'}, issued by ${c.issuer}. Claude course.`,
    ),
  );
  certifications.forEach((c, i) =>
    add(`cert-${i}`, 'Certifications', '/#journey', `Certification: ${c.name}, ${c.note.toLowerCase()}, ${c.issuer}, ${c.date}.`),
  );

  for (const p of projects) {
    const base = `/work/${p.slug}`;
    add(`${p.slug}-overview`, `${p.title} · Overview`, base, `${p.summary} Status: ${p.status.label}. ${p.timeframe}.`);
    if (p.team) add(`${p.slug}-team`, `${p.title} · Team`, base, `Team: ${p.team.join(', ')}.`);
    if (p.builtWith) add(`${p.slug}-stack`, `${p.title} · Built with`, base, `Built with ${p.builtWith.join(', ')}.`);
    if (p.deliverables) add(`${p.slug}-deliverables`, `${p.title} · Deliverables`, base, `Deliverables: ${p.deliverables.join('; ')}.`);
    const sections: [string, string, Block][] = [
      ['problem', 'Problem', p.problem],
      ['approach', 'Approach', p.approach],
      ['built', 'What I built', p.built],
      ['results', 'Results', p.results],
      ['next', 'What’s next', p.next],
    ];
    for (const [id, label, block] of sections) {
      blockText(block).forEach((t, i) => add(`${p.slug}-${id}-${i}`, `${p.title} · ${label}`, `${base}#${id}`, t));
      block.groups?.forEach((g, i) =>
        add(`${p.slug}-${id}-g${i}`, `${p.title} · ${g.title}`, `${base}#${id}`, `${g.title}: ${g.points.join('. ')}.`),
      );
    }
    if (p.results.metrics) {
      const m = p.results.metrics;
      add(
        `${p.slug}-metrics`,
        `${p.title} · Results`,
        `${base}#results`,
        `${m.caption}. ` + m.rows.map((r) => `${r.label}: ${r.before} to ${r.after} (${r.change}).`).join(' '),
      );
    }
  }

  for (const it of library) {
    const href = it.project === 'research' ? '/#library' : `/work/${it.project}#media`;
    add(`file-${it.id}`, `Documents · ${projectTitle(it.project)}`, href, `${it.title}: ${it.description} (${metaLine(it)})`);
  }

  githubProjects.forEach((g, i) =>
    add(`gh-${i}`, `GitHub · ${g.title}`, '/#github', `${g.title}: ${g.summary} ${g.points.join('. ')}. Built with ${g.stack.join(', ')}.${g.team ? ' ' + g.team + '.' : ''}`),
  );
  githubCoursework.forEach((g, i) => add(`ghc-${i}`, `GitHub · ${g.title}`, '/#github', `${g.title}: ${g.summary} Code at ${GITHUB}/${g.repo}.`));
  research.forEach((r, i) =>
    add(`research-${i}`, `Research & security · ${r.area}`, '/#research', `${r.area}. ${r.note} ${r.items.join('. ')}.`),
  );
  fieldNotes.forEach((n, i) => add(`note-${i}`, `Field note · ${n.topic}`, '/#notes', n.quote));
  practices.forEach((p, i) => add(`practice-${i}`, `How I work · ${p.title}`, '/#practice', `${p.title}. ${p.body}`));
  add('skills-built', 'Skills · Built with', '/#knowledge', `Built with: ${skills.builtWith.map((s) => s.name).join(', ')}.`);
  add('skills-explored', 'Skills · Explored and learning', '/#knowledge', `Explored and learning: ${skills.explored.join(', ')}.`);
  add(
    'skills-courses',
    'Skills · Courses',
    '/#knowledge',
    'Courses: ' + skills.courses.map((c) => `${c.name} (${c.provider}${c.status ? ', ' + c.status.toLowerCase() : ''})`).join('; ') + '.',
  );
  journey.forEach((j, i) => add(`journey-${i}`, `Journey · ${j.title}`, '/#journey', `${j.when}: ${j.title}. ${j.body}`));

  return ps;
}

let index: BM25 | null = null;
export function getIndex(): BM25 {
  if (!index) index = new BM25(buildPassages());
  return index;
}

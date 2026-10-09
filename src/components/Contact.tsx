import { contact, site } from '../content/portfolio';
import { useOverlays } from '../overlays';
import { withBase } from '../router';
import { ArrowUpRight, GitHubIcon, LinkedInIcon, LocalTime } from './kit';
import { Rich } from './ui';

/** The big coral sign-off at the bottom of every page. */
export function Contact() {
  const { openAsk } = useOverlays();
  const linkedin = contact.links.find((l) => l.label === 'LinkedIn')?.href;
  const github = contact.links.find((l) => l.label === 'GitHub')?.href;
  const pending = contact.links.filter((l) => !l.href);
  return (
    <footer id="contact" className="tone-coral relative overflow-hidden pt-24 pb-8 md:pt-32">
      <div className="wrap grid gap-14">
        <p className="kicker">Got a project, a role or a question?</p>
        <h2 className="display reveal text-[clamp(3.6rem,1.4rem+10vw,12rem)]">
          <span className="line" style={{ '--i': 0 } as React.CSSProperties}>
            <span>Let’s talk.</span>
          </span>
        </h2>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="flex flex-wrap gap-3">
            {linkedin ? (
              <a href={linkedin} target="_blank" rel="me noopener" className="btn btn-solid" data-cursor="Say hi">
                <LinkedInIcon /> LinkedIn <ArrowUpRight size={16} />
              </a>
            ) : null}
            {github ? (
              <a href={github} target="_blank" rel="me noopener" className="btn btn-solid" data-cursor="Code">
                <GitHubIcon /> GitHub <ArrowUpRight size={16} />
              </a>
            ) : null}
            {contact.resume.href ? (
              <a href={withBase('/' + contact.resume.href)} className="btn" download>
                Download résumé
              </a>
            ) : null}
            <button type="button" className="btn" onClick={() => openAsk('')} data-cursor="Ask">
              Ask my portfolio
            </button>
          </div>
          <ul className="grid gap-1 text-[0.95rem] lg:text-right">
            <li>
              Lahore, Pakistan · <LocalTime />
            </li>
            {pending.map((l) => (
              <li key={l.label}>
                {l.label}: <Rich text={l.display} />
              </li>
            ))}
            {contact.resume.href ? null : (
              <li>
                Résumé: <Rich text="[TODO: add public/resume.pdf]" />
              </li>
            )}
          </ul>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#0d0d0d] pt-5 text-[0.85rem]">
          <p>© 2026 {site.name}</p>
          <p>Ask my portfolio runs BM25 retrieval in your browser. No LLM, no API calls.</p>
          <a href="#main" className="quiet-link">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

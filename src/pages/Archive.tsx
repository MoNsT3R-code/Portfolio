import { useId, useMemo, useState } from 'react';
import { library, projectTitle, showHeld, typeLabel } from '../content/library';
import type { LibraryType } from '../content/library';
import { Lines } from '../components/kit';
import { MediaList } from '../components/MediaList';

const TYPES: (LibraryType | 'all')[] = ['all', 'video', 'deck', 'document', 'interactive', 'image'];

export function Archive() {
  const [type, setType] = useState<LibraryType | 'all'>('all');
  const [project, setProject] = useState('all');
  const selectId = useId();
  const projectsWithFiles = useMemo(() => [...new Set(library.map((i) => i.project))], []);
  const items = library.filter((it) => (type === 'all' || it.type === type) && (project === 'all' || it.project === project));
  const count = (t: LibraryType | 'all') => library.filter((it) => (t === 'all' || it.type === t) && (project === 'all' || it.project === project)).length;
  const held = library.filter((i) => i.hold).length;

  return (
    <section aria-labelledby="archive-title" className="tone-paper pt-36 pb-24">
      <div className="wrap grid gap-10">
        <h1 id="archive-title" className="display d-xl">
          <Lines hero lines={[<>Archive<span className="text-coral">.</span></>]} />
        </h1>
        <p className="lead measure">
          Every deck, report, video and interactive page behind the projects: {library.length} files, opened right here in your
          browser.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {TYPES.filter((t) => t === 'all' || count(t)).map((t) => (
            <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={`btn btn-sm ${type === t ? 'btn-solid' : ''}`}>
              {t === 'all' ? 'All' : `${typeLabel[t]}s`} <span className="opacity-70">{count(t)}</span>
            </button>
          ))}
          <label htmlFor={selectId} className="sr-only">
            Filter by project
          </label>
          <select
            id={selectId}
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="btn btn-sm max-w-full appearance-none truncate bg-transparent pr-8"
          >
            <option value="all">All projects</option>
            {projectsWithFiles.map((p) => (
              <option key={p} value={p}>
                {projectTitle(p)}
              </option>
            ))}
          </select>
        </div>
        {showHeld && held ? (
          <p className="max-w-3xl rounded-2xl border border-dashed border-[#c2410c] bg-[#fff4e0] px-4 py-3 text-[0.9rem] text-[#5a2a00]">
            <strong>Only on your computer:</strong> {held} files marked “Held” are internal Stewart material or need you to confirm
            you made them. They are left out of the published site until you set <code>PUBLISH_HELD</code>.
          </p>
        ) : null}
        <MediaList items={items} />
        {items.length === 0 ? <p>Nothing matches those filters.</p> : null}
      </div>
    </section>
  );
}

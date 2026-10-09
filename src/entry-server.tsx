import { renderToString } from 'react-dom/server';
import { App } from './App';
import { library } from './content/library';
import { GITHUB, PUBLISH_HELD, SITE_URL, githubProjects, person, projects, sections, site } from './content/portfolio';
import { allPaths, headFor, headTags } from './head';

export function render(url: string) {
  return { html: renderToString(<App initialPath={url} />), head: headFor(url) };
}

export { allPaths, headTags, SITE_URL, PUBLISH_HELD, person, projects, sections, site, library, githubProjects, GITHUB };

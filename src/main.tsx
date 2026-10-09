import './styles/index.css';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { stripBase } from './router';

const root = document.getElementById('root')!;
const path = stripBase(window.location.pathname);
const app = <App initialPath={path} />;

// Hydrate only when the prerendered HTML belongs to this URL. Hosts that fall back to index.html
// for unknown paths (and the 404 page) get a fresh client render instead of a hydration mismatch.
if (root.firstElementChild && root.dataset.route === path) {
  hydrateRoot(root, app);
} else {
  root.textContent = '';
  createRoot(root).render(app);
}

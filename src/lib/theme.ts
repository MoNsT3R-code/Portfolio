export type ThemeChoice = 'light' | 'dark' | 'system';

const KEY = 'theme';

export function effectiveTheme(): 'light' | 'dark' {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
  try {
    if (choice === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {
    // storage unavailable: the choice still applies for this visit
  }
}

export function toggleTheme() {
  setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark');
}

export const languages = ['en', 'es'] as const;

export type Lang = (typeof languages)[number];

/** Shown when the visitor's language isn't supported, and the fallback for empty translations. */
export const defaultLang = 'en' satisfies Lang;

export const languageNames: Record<Lang, string> = {
  en: 'English',
  es: 'Español',
};

const STORAGE_KEY = 'lang';

export function isLang(value: unknown): value is Lang {
  return languages.includes(value as Lang);
}

/** Saved choice first, then the browser's languages, then the default. */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // Storage can be blocked (privacy mode); fall through to the browser.
  }

  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.slice(0, 2).toLowerCase();
    if (isLang(base)) return base;
  }

  return defaultLang;
}

/** Only an explicit choice is saved, so detection keeps following the browser until then. */
export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Not persisting is fine; the choice still applies for this visit.
  }
}

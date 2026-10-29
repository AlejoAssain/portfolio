import { ChevronDown } from 'lucide-react';

import { isLang, languageNames, languages } from '@/i18n/languages';
import { useLanguage } from '@/i18n/LanguageProvider';

// A native select keeps the header compact and gives phones their own picker.
// Closed, it shows just the code; the real select sits invisible on top of it
// so clicks, keyboard and screen readers all go to the native control.
export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="relative flex items-center gap-1 rounded-sm px-2 py-2 font-mono text-mono-xs text-muted-foreground transition-colors duration-[var(--duration-micro)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring hover:text-foreground">
      <span aria-hidden="true" className="uppercase">
        {lang}
      </span>
      <ChevronDown aria-hidden="true" className="size-3.5" />
      <select
        aria-label={t.language.label}
        value={lang}
        onChange={(event) => isLang(event.target.value) && setLang(event.target.value)}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0 focus-visible:outline-none"
      >
        {languages.map((code) => (
          <option key={code} value={code} lang={code}>
            {languageNames[code]}
          </option>
        ))}
      </select>
    </div>
  );
}

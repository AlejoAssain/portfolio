import { languageNames, languages } from '@/i18n/languages';
import { useLanguage } from '@/i18n/LanguageProvider';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="flex items-center rounded-full border border-border bg-card/80 p-1 backdrop-blur-lg"
    >
      {languages.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-label={languageNames[code]}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={cn(
            'rounded-full px-2.5 py-1 font-mono text-mono-xs uppercase transition-colors',
            lang === code
              ? 'bg-primary/15 text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

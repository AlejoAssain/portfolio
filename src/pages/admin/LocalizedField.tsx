import { useId } from 'react';

import { defaultLang, languageNames, languages } from '@/i18n/languages';
import type { LocalizedText } from '@/i18n/localize';
import { cn } from '@/lib/utils';
import { Field } from './shared';

/** One input per language. Only the default language can be required; empty ones fall back to it. */
export function LocalizedField({
  label,
  value,
  onChange,
  textarea,
  required,
}: {
  label: string;
  value: LocalizedText | undefined;
  onChange: (value: LocalizedText) => void;
  textarea?: boolean;
  required?: boolean;
}) {
  const id = useId();
  const text = value ?? { [defaultLang]: '' };

  return (
    <div className={cn('grid gap-4', !textarea && 'sm:grid-cols-2')}>
      {languages.map((lang) => (
        <Field
          key={lang}
          id={`${id}-${lang}`}
          label={`${label} · ${languageNames[lang]}`}
          textarea={textarea}
          value={text[lang] ?? ''}
          required={required && lang === defaultLang}
          placeholder={
            lang === defaultLang
              ? undefined
              : `Empty uses ${languageNames[defaultLang]}`
          }
          onChange={(event) => onChange({ ...text, [lang]: event.target.value })}
        />
      ))}
    </div>
  );
}

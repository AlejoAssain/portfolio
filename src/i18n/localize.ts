import { defaultLang, type Lang } from './languages';

/** Text stored once per language. The default language is always present. */
export type LocalizedText = Record<typeof defaultLang, string> &
  Partial<Record<Lang, string>>;

/** Picks the text for `lang`, falling back to the default language when it's missing or blank. */
export function localize(text: LocalizedText, lang: Lang): string {
  const value = text[lang];
  return value?.trim() ? value : text[defaultLang];
}

/**
 * Normalizes a DB value into LocalizedText.
 *
 * ponytail: accepts plain strings so this front works against the schema both
 * before and after the i18n migration. Drop the string branch once it's applied.
 */
export function toLocalized(value: LocalizedText | string): LocalizedText {
  return typeof value === 'string' ? { [defaultLang]: value } : value;
}

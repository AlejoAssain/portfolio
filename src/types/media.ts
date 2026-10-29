import type { LocalizedText } from '@/i18n/localize';

export type ProjectScreenshot = {
  id: string;
  url: string;
  storagePath?: string;
  alt: LocalizedText;
  cover: boolean;
};

export type PublicScreenshot = Omit<ProjectScreenshot, 'alt'> & { alt: string };

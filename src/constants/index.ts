import type { Language } from '@/types';

export const SITE_NAME = 'AquaClean';
export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'bg', name: 'Български' },
];

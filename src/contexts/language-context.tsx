'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Language } from '@/types';
import { DEFAULT_LANGUAGE } from '@/constants';
import { getTranslation as getLangTranslation } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, count?: number) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLanguage = localStorage.getItem('app-language') as Language | null;
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isMounted) {
      localStorage.setItem('app-language', lang);
      document.documentElement.lang = lang;
    }
  };
  
  useEffect(() => {
    if (isMounted) {
        document.documentElement.lang = language;
    }
  }, [language, isMounted]);


  const t = useCallback((key: string, count?: number) => {
    if (!isMounted) return key; // Return key if not mounted to avoid hydration mismatch
    return getLangTranslation(key, language, count);
  }, [language, isMounted]);

  if (!isMounted) {
    // Render a placeholder or null during server-side rendering or before hydration
    // to prevent hydration mismatches, or ensure default values match server.
    // For simplicity, children are rendered, assuming default lang matches server.
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

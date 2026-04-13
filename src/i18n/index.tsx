import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from './translations';

interface I18nContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const savedLang = localStorage.getItem('el-cobrador-language') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en') {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('el-cobrador-language', lang);
  };

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}

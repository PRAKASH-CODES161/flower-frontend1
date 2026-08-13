import React, { createContext, useState, useContext, useEffect } from 'react';
import { en } from '../locales/en';
import { ta } from '../locales/ta';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_language', lang);
  }, [lang]);

  const t = lang === 'ta' ? ta : en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

import React, { createContext, useContext, useState } from "react";

interface LanguageProviderProps {
  children: React.ReactNode;
}

interface ILanguageContext {
  language: string;
  changeLanguage: (newLanguage: string) => void;
}

export const LanguageContext = createContext<ILanguageContext | undefined>(undefined);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState("en");

  const changeLanguage = (newLanguage: string) : void => setLanguage(newLanguage);

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
    }} >
      { children }
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error('useLanguage must be used inside FiltersProvider');
  return context;
};

import { createContext, useContext, useState } from "react";

const LanguageContext = createContext("en")


const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en")

  const changeLanguage = (newLanguage) => setLanguage(newLanguage)

  const value = {
    language: language,
    changeLanguage: changeLanguage
  }

  console.log(language)

  return (
    <LanguageContext.Provider value={ value } >
      { children }
    </LanguageContext.Provider>
  )
}


const useLanguage = () => useContext(LanguageContext)


export { LanguageProvider, LanguageContext, useLanguage}

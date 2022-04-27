import { lightTheme, darkTheme } from "./theme/Themes";
import { ThemeProvider } from "styled-components";
import { useState } from 'react';
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import ParticlesBackground from "./components/ParticlesBackground";

// custom components and hooks
import Container from "./components/Container";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import About from "./components/about/About";
import Skills from "./components/skills/Skills";
import Footer from "./components/footer/Footer";
import Projects from "./components/projects/Projects";
import { LanguageProvider } from "./useLanguage";


// 1- change projects looking

const App = () => {

  const [theme, setTheme] = useState(darkTheme);

  const [language, setLanguage] = useState("en")

  const changeTheme = () => {
    if (theme.themeName === "dark") {
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }
  }

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
  }

  const location = useLocation();

  return (
    <>
      <ThemeProvider theme={theme}>
        <LanguageProvider value={language}>
          <ParticlesBackground themeName={theme.themeName} />
          <Container>
            <AnimatePresence>
              <Navbar  
                changeLanguage={changeLanguage} 
                changeTheme={changeTheme} 
                themeName={theme.themeName} 
                key={theme.themeName} />
            </AnimatePresence>
            <AnimatePresence exitBeforeEnter>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} /> 
                <Route path="/about" element={<About />} /> 
                <Route path="/skills" element={<Skills />} /> 
                <Route path="/projects" element={<Projects/>} />
              </Routes>
            </AnimatePresence>
            <AnimatePresence>
              <Footer />
            </AnimatePresence>
          </Container>
        </LanguageProvider>
      </ThemeProvider>
    </>
  );
}

export default App;

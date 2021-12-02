import { lightTheme, darkTheme } from "./theme/Themes"
import { ThemeProvider } from "styled-components"
import { useState } from 'react';
import { Routes, Route, useLocation } from "react-router"
import { AnimatePresence } from "framer-motion";
import ParticlesBackground from "./components/ParticlesBackground";

// custom components
import Container from "./components/Container"
import Navbar from "./components/navbar/Navbar"
import Home from "./components/home/Home"
import About from "./components/about/About";
import Skills from "./components/skills/Skills";
import Footer from "./components/footer/Footer";
// import ContactForm from "./components/contact/ContactForm";


const App = () => {

  const [theme, setTheme] = useState(darkTheme)

  const toggleTheme = () => {
    if (theme.themeName === "dark") {
      setTheme(lightTheme)
    } else {
      setTheme(darkTheme)
    }
  }

  const location = useLocation()

  return (
    <>
      <ThemeProvider theme={theme}>
        <ParticlesBackground themeName={theme.themeName} />
        <Container>
          <AnimatePresence>
            <Navbar changeTheme={toggleTheme} themeName={theme.themeName} key={theme.themeName} />
          </AnimatePresence>
          <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} /> 
              <Route path="/about" element={<About />} /> 
              <Route path="/skills" element={<Skills />} /> 
              {/* <Route path="/contact" element={<ContactForm />} /> */}
            </Routes>
          </AnimatePresence>
          <AnimatePresence>
            <Footer />
          </AnimatePresence>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;

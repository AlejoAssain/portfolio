import { lightTheme, darkTheme } from "./theme/Themes"
import { ThemeProvider } from "styled-components"
import { useState } from 'react';
import Container from "./components/Container"
import Navbar from "./components/navbar/Navbar"
import Home from "./components/home/Home"
import About from "./components/about/About";
import Skills from "./components/skills/Skills";
import { Routes, Route, useLocation } from "react-router"
import { AnimatePresence } from "framer-motion";


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

  // console.log(`Theme: ${theme.themeName}`)
  // console.log(location.pathname)

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container>
          <AnimatePresence>
            <Navbar changeTheme={toggleTheme} themeName={theme.themeName} key={theme.themeName} />
            
          </AnimatePresence>
          <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} /> 
              <Route path="/about" element={<About />} /> 
              <Route path="/skills" element={<Skills />} /> 
            </Routes>
          </AnimatePresence>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;

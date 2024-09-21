import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { darkTheme, lightTheme } from './themes';
import Container from './components/Container.tsx';
import { ParticlesBackground } from './components/ParticlesBackground';
import { Navbar } from './components/navbar/Navbar.tsx';
import Home from './components/home/Home.tsx';
import { Projects } from './components/projects/Projects.tsx';
import { Skills } from './components/skills/Skills.tsx';
import { AboutPage } from './pages';
import { Footer } from './components/footer/Footer.tsx';

const App = () => {
  const [theme, setTheme] = useState(darkTheme);

  const changeTheme = () => {
    if (theme.themeName === 'dark') {
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }
  };

  const location = useLocation();

  return (
    <>
      <ThemeProvider theme={theme}>
        <ParticlesBackground themeName={theme.themeName} />
        <Container>
          <AnimatePresence>
            <Navbar
              changeTheme={changeTheme}
              themeName={theme.themeName}
              key={theme.themeName}
            />
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
            </Routes>
          </AnimatePresence>
          <AnimatePresence>
            <Footer />
          </AnimatePresence>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;

import { lightTheme, darkTheme } from "./theme/Themes"
import { ThemeProvider } from "styled-components"
import { useState } from 'react';
import Container from "./components/Container"
import Navbar from "./components/navbar/Navbar"
import Home from "./components/home/Home"
import { Routes, Route } from "react-router"

const App = () => {

  const [theme, setTheme] = useState(darkTheme)

  const toggleTheme = () => {
    if (theme.themeName === "dark") {
      setTheme(lightTheme)
    } else {
      setTheme(darkTheme)
    }
  }

  console.log(`Theme: ${theme.themeName}`)
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container>
          <Navbar changeTheme={toggleTheme} themeName={theme.themeName} />
          
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/about" element={<h1>about page</h1>} /> 
            <Route path="/contact" element={<h1>contact page</h1>} /> 
          </Routes>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;

import { lightTheme, darkTheme } from "./theme/Themes"
import { ThemeProvider } from "styled-components"
import { useState } from 'react';
import Content from "./components/Content"


function App() {

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
        <Content changeTheme={toggleTheme} themeName={theme.themeName} />
      </ThemeProvider>
    </>
  );
}

export default App;

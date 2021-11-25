import Container from "./Container"
import Navbar from "./navbar/Navbar"
import { Routes, Route } from "react-router"

const Content = ({changeTheme, themeName}) => {
  return (
    <Container>
      <Navbar changeTheme={changeTheme} themeName={themeName} />
      <Routes >
        <Route path="/" element={<h1>Home page</h1>} /> 
        <Route path="/about" element={<h1>about page</h1>} /> 
        <Route path="/contact" element={<h1>contact page</h1>} /> 
      </Routes>
    </Container>
  )
}

export default Content
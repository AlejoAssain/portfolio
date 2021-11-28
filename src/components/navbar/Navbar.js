import styled from "styled-components"
import { useState } from "react"
import Logo from "./Logo"
import Menu from "./menu/Menu"
import Switch from "./switch/Switch"
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs"

const iconStyle = {
  marginLeft: "10px",
  alignSelf: "",
  flex: ""
}

const NavbarContainer = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 80;
  background-color: ${ ({theme}) => theme.navBg };
  border-bottom: 2px solid ${ ({theme}) => theme.text};
`

const NavbarWrapper = styled.div`
  margin: auto;
  width: 100%;
  max-width: 1300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
`

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Navbar = ({changeTheme, themeName}) => {

  const [menuState, setMenuState] = useState(false)

  const toggleMenuState = () => {
    setMenuState(!menuState)
  }

  console.log(menuState)

  return (
    <NavbarContainer>
      <NavbarWrapper>
        <Logo />
        <MenuWrapper>
          <Menu menuState={menuState} toggleMenuState={toggleMenuState} />
          { (themeName === "dark") 
            ? <BsFillMoonFill style={iconStyle} /> 
            : <BsFillSunFill style={iconStyle} />
          }
          <Switch changeTheme={changeTheme} />
        </MenuWrapper>
      </NavbarWrapper>
    </NavbarContainer>
  )
}

export default Navbar
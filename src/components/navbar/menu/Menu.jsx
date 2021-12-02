import { MenuWrapper, MenuLink, LinkContainer, MenuIcon } from "./Menu-components"
import { useLocation } from "react-router"

const Menu = ({menuState, toggleMenuState}) => {

  const location = useLocation()

  const closeMenu = () => (menuState === true) ? toggleMenuState() : null

  return (
    <>
      <MenuIcon onClick={toggleMenuState} />
      <MenuWrapper menuState={menuState}>        
        <LinkContainer 
          end 
          to="/"                  
          state={location.pathname}
          className="nav-link"
          onClick={closeMenu}
        >
          <MenuLink>
            Home
          </MenuLink>
        </LinkContainer>          
        <LinkContainer 
          end 
          to="/skills"                  
          state={location.pathname}
          className="nav-link"
          onClick={closeMenu}
        >
          <MenuLink>
            My Skills
          </MenuLink>
        </LinkContainer>            
        <LinkContainer 
          end 
          to="/about"                  
          state={location.pathname}
          className="nav-link"
          onClick={closeMenu}
        >
          <MenuLink>
            About Me
          </MenuLink>
        </LinkContainer>        
      </MenuWrapper>
    </>
  )
}

export default Menu 
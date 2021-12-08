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
            Inicio
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
            Habilidades
          </MenuLink>
        </LinkContainer>
        <LinkContainer 
          end 
          to="/projects"                  
          state={location.pathname}
          className="nav-link"
          onClick={closeMenu}
        >
          <MenuLink>
            Proyectos
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
            Sobre Mi
          </MenuLink>
        </LinkContainer>        
      </MenuWrapper>
    </>
  )
}

export default Menu 
import { MenuWrapper, MenuLink, LinkContainer, MenuIcon } from "./Menu-components"
import { useLocation } from "react-router"
import applicationTexts from "../../../static/applicationTexts"
import { useLanguage } from "../../../useLanguage"

const Menu = ({menuState, toggleMenuState}) => {
  const { language } = useLanguage()

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
            { applicationTexts[language].menu.home }
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
            { applicationTexts[language].menu.skills }
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
            { applicationTexts[language].menu.projects }
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
            { applicationTexts[language].menu.aboutMe }
          </MenuLink>
        </LinkContainer>        
      </MenuWrapper>
    </>
  )
}

export default Menu 
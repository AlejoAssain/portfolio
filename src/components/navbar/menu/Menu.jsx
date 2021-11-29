import { NavLink } from "react-router-dom"
import { MenuWrapper, MenuItem, MenuIcon } from "./Menu-components"
import { useLocation } from "react-router"

const Menu = ({menuState, toggleMenuState}) => {

  const location = useLocation()

  return (
    <>
      <MenuIcon onClick={toggleMenuState} />
      <MenuWrapper menuState={menuState}>
        <MenuItem>
          <NavLink 
            end 
            to="/"                    
            children="Home"
            state={location.pathname}
          />                
        </MenuItem>
        <MenuItem>
          <NavLink 
            end 
            to="/skills"          
            children="My Skills"
            state={location.pathname}
          />          
        </MenuItem>        
        <MenuItem>  
          <NavLink 
            end 
            to="/about"          
            children="About Me"
            state={location.pathname}
          />
        </MenuItem>
      </MenuWrapper>
    </>
  )
}

export default Menu 
import { NavLink } from "react-router-dom"
import { MenuWrapper, MenuItem, MenuIcon } from "./Menu-components"

const Menu = ({menuState, toggleMenuState}) => {
  return (
    <>
      <MenuIcon onClick={toggleMenuState} />
      <MenuWrapper menuState={menuState}>
        <MenuItem>
          <NavLink 
            end 
            to="/"                    
            children="Home"
          />                
        </MenuItem>
        <MenuItem>
          <NavLink 
            end 
            to="/about"          
            children="About"
          />
        </MenuItem>
        <MenuItem>  
          <NavLink 
            end 
            to="/contact"          
            children="Contact"
          />
        </MenuItem>
      </MenuWrapper>
    </>
  )
}

export default Menu 
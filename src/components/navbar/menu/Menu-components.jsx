import styled from "styled-components"
import { VscThreeBars } from "react-icons/vsc"
import { motion } from "framer-motion"
import { NavLink } from "react-router-dom"

export const MenuWrapper = styled.ul`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 750px) {
    display: ${ ({menuState}) => menuState ? "flex" : "none"};
    position: fixed;
    background-color: ${ ({theme}) => theme.navBg};
    z-index: 100;
    flex-direction: column;
    padding: 0;
    top: 49px;
    left: 0;
    width: 100vw;
    height: 20vh;
  }
`

export const Item = styled(motion.li)`
  height: 100%;
  padding: 0.5rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;

  
  @media (max-width: 750px) {
    
  }
`

export const LinkContainer = styled(NavLink)`  
  text-decoration: none;
  color: ${ ({theme}) => theme.navText };
    
  &.active {
    color: ${ ({theme}) => theme.activeLink};
    transition: color 1s;
  }
`

export const MenuLink = ({children}) => {
  return (
    <Item
      whileHover={{scale:1.2}}
      whileTap={{scale:0.9}}
    >
      {children}
    </Item>
  )
}


export const MenuIcon = styled(VscThreeBars)`
  cursor: pointer;
  @media (min-width: 751px) {
    display: none;
  }
`
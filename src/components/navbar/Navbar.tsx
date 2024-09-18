import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BsFillMoonFill, BsFillSunFill} from 'react-icons/bs';
import { LanguageSelector } from './LanguageSelector.tsx';

import { Logo } from './Logo';
import { Menu } from './menu/Menu';
import { Switch } from './switch/Switch';

const iconStyle = {
  marginLeft: "10px",
  alignSelf: "",
  flex: ""
}

const NavbarContainer = styled(motion.div)`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 80;
  background-color: ${ ({theme}) => theme.navBg };
  color: ${ ({theme}) => theme.navText};
  /* border-bottom: 2px solid ${ ({theme}) => theme.navText}; */
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

interface Props {
  changeTheme: () => void;
  themeName: string;
}

export const Navbar = ({changeTheme, themeName}: Props) => {
  const [menuState, setMenuState] = useState(false)

  const toggleMenuState = () => {
    setMenuState(!menuState)
  }

  return (
    <NavbarContainer
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.5}}
    >
      <NavbarWrapper>
        <Logo />
        <MenuWrapper>
          <Menu menuState={menuState} toggleMenuState={toggleMenuState} />
          { (themeName === "dark") 
            ? <BsFillMoonFill style={iconStyle} /> 
            : <BsFillSunFill style={iconStyle} />
          }
          <Switch changeTheme={changeTheme} />
          <LanguageSelector />
        </MenuWrapper>
      </NavbarWrapper>
    </NavbarContainer>
  )
}

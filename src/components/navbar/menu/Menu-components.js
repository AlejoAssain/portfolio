import styled from "styled-components"
import { VscThreeBars } from "react-icons/vsc"

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

export const MenuItem = styled.li`
  height: 100%;
  padding: 0.5rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;

  & a {
    text-decoration: none;
    color: ${ ({theme}) => theme.text };
  }

  & .active {
    padding-bottom: 5px;
    border-bottom: 1px solid ${ ({theme}) => theme.activeLink};
    color: ${ ({theme}) => theme.activeLink};
  }

  @media (max-width: 750px) {
    
  }
`

export const MenuIcon = styled(VscThreeBars)`
  cursor: pointer;
  @media (min-width: 751px) {
    display: none;
  }
`
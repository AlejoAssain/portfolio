import { useLocation } from 'react-router-dom';

import { useLanguage } from '../../../providers';
import { applicationTexts } from '../../../static/applicationTexts.ts';
import { LinkContainer, MenuIcon, MenuLink, MenuWrapper } from './Menu-components.tsx';

interface Props {
  menuState: boolean;
  toggleMenuState: () => void;
}

export const Menu = ({menuState, toggleMenuState}: Props) => {
  const { language } = useLanguage();
  const location = useLocation();

  const closeMenu = () => menuState ? toggleMenuState() : null;

  return (
    <>
      <MenuIcon onClick={toggleMenuState} />
      <MenuWrapper $menuState={menuState}>
        <LinkContainer 
          end 
          to="/"                  
          state={location.pathname}
          className="nav-link"
          onClick={closeMenu}
        >
          <MenuLink>
            {
              language === 'en' ? applicationTexts[language].menu.home :
              language === 'es' ? applicationTexts[language].menu.home
                : null
            }
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
            {
              language === 'en' ? applicationTexts[language].menu.skills :
              language === 'es' ? applicationTexts[language].menu.skills
                : null
            }
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
            {
              language === 'en' ? applicationTexts[language].menu.projects :
                language === 'es' ? applicationTexts[language].menu.projects
                  : null
            }
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
            {
              language === 'en' ? applicationTexts[language].menu.aboutMe :
                language === 'es' ? applicationTexts[language].menu.aboutMe
                  : null
            }
          </MenuLink>
        </LinkContainer>        
      </MenuWrapper>
    </>
  )
}

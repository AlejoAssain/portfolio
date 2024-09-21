import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { RiArrowDownSFill } from 'react-icons/ri';

import { useLanguage } from '../../providers';
import { applicationTexts } from '../../static/applicationTexts';

const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  user-select: none;
  cursor: pointer;
`;

const ListWrapper = styled.div`
  background-color: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.bg};
  width: 50px;
  height: 50px;
  position: relative;
  right: 50px;
  top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const LanguageContainer = styled.div`
  width: 100%;
  border-bottom: ${({ theme }) => theme.bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  const [showMenu, setShowMenu] = useState(false);

  const toggleShowMenu = () => setShowMenu(!showMenu);

  const languagesName: string[] = [];
  for (const key in applicationTexts) {
    languagesName.push(key.toUpperCase());
  }

  return (
    <SectionWrapper onClick={toggleShowMenu}>
      <label>{language.toUpperCase()}</label>
      <ArrowContainer
        animate={{
          rotate: showMenu ? 180 : 0,
        }}
        transition={{
          duration: 0.2,
          type: 'tween',
        }}
      >
        <RiArrowDownSFill size={'1.5rem'} />
      </ArrowContainer>
      {showMenu ? (
        <div style={{ width: 0, height: 0 }}>
          <ListWrapper>
            {languagesName.map((langName) => (
              <LanguageContainer
                key={langName}
                onClick={() => {
                  changeLanguage(langName.toLowerCase());
                  toggleShowMenu();
                }}
              >
                {langName}
              </LanguageContainer>
            ))}
          </ListWrapper>
        </div>
      ) : null}
    </SectionWrapper>
  );
};

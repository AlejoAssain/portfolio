import styled from 'styled-components';
import { FaLinkedin, FaGithubSquare } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FooterWrapper = styled(motion.div)`
  bottom: 5vh;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4vh;
  padding: 10px;
  transition: color 1s;
  color: ${({ theme }) => theme.text};

  @media (max-width: 750px) {
    flex-direction: column;
    bottom: 2px;
  }

  & svg {
    margin: 0;
    padding: 0 3px;
  }
`;

interface IconContainerProps {
  to: string;
  children: React.ReactNode;
}

const IconContainer = ({ to, children }: IconContainerProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.2,
      }}
      whileTap={{
        scale: 0.9,
      }}
      style={{
        cursor: 'pointer',
      }}
      onClick={() => {
        window.open(to, '_blank');
      }}
    >
      {children}
    </motion.div>
  );
};

export const Footer = () => {
  return (
    <FooterWrapper
      initial={{
        x: '-25vw',
      }}
      animate={{
        x: '1vw',
      }}
    >
      <IconContainer to="https://linkedin.com/in/alejoassain/">
        <FaLinkedin />
      </IconContainer>
      <IconContainer to="https://github.com/AlejoAssain">
        <FaGithubSquare />
      </IconContainer>
    </FooterWrapper>
  );
};

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const AboutDataContainer = styled(motion.div)`
  margin: 68px 5vw 0 20vw;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid ${({ theme }) => theme.text};
  border-radius: 30px;
    /* color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bg};
  transition: color 2s;
  transition: background-color 2s; */

  @media (max-width: 750px) {
    padding: 0;
    border: none;
    margin-bottom: 100px;
  }
`;

export const AboutDataText = styled.div`
  max-width: 70vw;
  padding: 40px;
  font-size: 17px;
  @media (max-width: 750px) {
    font-size: 20px;
    max-width: 80vw;
    padding: 20px 0;
  }
`;

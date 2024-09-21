import { motion } from 'framer-motion';
import styled from 'styled-components';

export const ButtonContainer = styled(motion.button)`
  max-width: 300px;
  align-self: center;
  margin-bottom: 5px;
  font-size: 20px;
  padding: 15px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.text};
  color: ${({ theme }) => (theme.themeName === 'dark' ? '#000' : '#fff')};
  transition: color 1s;
  transition: background-color 1s;
`;

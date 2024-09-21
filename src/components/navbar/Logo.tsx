import { GiDwarfFace } from 'react-icons/gi';
import styled from 'styled-components';

const IconLogo = styled.div`
  padding-top: 13px;
  padding-bottom: 20px;
  margin: 0 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  user-select: none;
`;

export const Logo = () => {
  return (
    <IconLogo>
      <GiDwarfFace size={'1.4em'} />
      Alejo
    </IconLogo>
  );
};

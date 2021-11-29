import styled from "styled-components";
import DescriptionBox from "./DescriptionBox";
import Avatar from "./Avatar";
import SectionContainer from "../SectionContainer";

const HomeWrapper = styled.div`
  border-bottom: 3px solid ${({theme}) => theme.text};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Home = () => {
  return (
    <SectionContainer>
      <HomeWrapper>
        <DescriptionBox />
        <Avatar />
      </HomeWrapper>
    </SectionContainer>
    
  );
}

export default Home

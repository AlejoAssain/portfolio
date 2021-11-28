import styled from "styled-components";
import DescriptionBox from "./DescriptionBox";
import Avatar from "./Avatar";

const HomeContainer = styled.div`
  box-sizing:border-box ;
  padding: 0;
  margin: 0;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
`

const HomeWrapper = styled.div`
  border-bottom: 3px solid ${({theme}) => theme.text};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Home = () => {
  return (
    <HomeContainer>
      <HomeWrapper>
        <DescriptionBox />
        <Avatar />
      </HomeWrapper>
    </HomeContainer>
  );
}

export default Home

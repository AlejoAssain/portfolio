import styled from "styled-components";
import DescriptionBox from "./DescriptionBox";
import Avatar from "./Avatar";
import SectionContainer from "../SectionContainer";
import { motion } from "framer-motion";

const HomeWrapper = styled(motion.div)`
  border-bottom: 3px solid ${({theme}) => theme.text};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Home = () => {
  return (
    <SectionContainer>
      <HomeWrapper
        whileHover={{ scale: 1.1 }}
      >
        <DescriptionBox />
        <Avatar />
      </HomeWrapper>
    </SectionContainer>
    
  );
}

export default Home

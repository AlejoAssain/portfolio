import SectionContainer from "../SectionContainer.js";
import styled from "styled-components"
import { motion } from "framer-motion";
import rocket from "./rocket.svg";
import { applicationTexts } from "../../static/applicationTexts.js";
import { useLanguage } from "../../providers";


const AboutWrapper = styled(motion.div)`
  margin: 0 5vw;
  margin-left: 20vw;
  margin-top: 68px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid ${ ({theme}) => theme.text};
  border-radius: 30px;
  /* color: ${ ({theme}) => theme.text};
  background-color: ${ ({theme}) => theme.bg};
  transition: color 2s;
  transition: background-color 2s; */

  @media (max-width: 750px) {
    padding: 0;
    border: none;
    margin-bottom: 100px;
  }
`

const Text = styled.div`
  max-width: 70vw;
  padding: 40px;
  font-size: 17px;
  @media (max-width: 750px) {
    font-size: 20px;
    max-width: 80vw;
    padding: 20px 0;
  }
`

const Rocket = () => {
  return (  
    <motion.img
      className="rocket"
      style={{
        position: "absolute",
        left: "5vw",
        top: "40vh",
        display: "sticky",
        height: "10vw"
      }}
      src={rocket}
      animate={{        
        y: "10vh"
      }}
      transition={{
        duration: 5,
        yoyo: Infinity
      }}
    />         
  )
}

export const About = () => {
  const { language } = useLanguage()


  return (
    <SectionContainer>
      <Rocket />
      <AboutWrapper
        whileHover={{
          scale: 1.03
        }}
      >
        <Text>
          {
            language === 'en' ? applicationTexts[language].aboutMe.text1 :
              applicationTexts['es'].aboutMe.text1
          }
        </Text>
        <Text>
          {
            language === 'en' ? applicationTexts[language].aboutMe.text2 :
              applicationTexts['es'].aboutMe.text2
          }
        </Text>
        <Text>
          {
            language === 'en' ? applicationTexts[language].aboutMe.text3 :
              applicationTexts['es'].aboutMe.text3
          }
        </Text>
      </AboutWrapper>        
    </SectionContainer>
  )
}

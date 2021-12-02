import SectionContainer from "../SectionContainer";
import styled from "styled-components"
import { motion } from "framer-motion";
import rocket from "./rocket.svg"
// import ContactButton from "./ContactButton";

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

const About = () => {
  return (
    <SectionContainer>
      <Rocket />
      <AboutWrapper
        whileHover={{
          scale: 1.03
        }}
      >
        <Text>
          I'm a 21 years old Software Developer from Córdoba, Argentina. I've been learning the basics of the Software Engenieering for the last
          3 years, by myself and in Systems Engineering career at Universidad Tecnológica Nacional - Facultad Regional Córdoba.
        </Text>
        <Text>
          In 2021 I decided to put myself 100% on learning web development. So I started taking some courses, like "100 Days of Code: The Complete
          Python Pro Bootcamp for 2022" and "React - Definitive guide: Hooks Router Redux Next", with the basics that I generated with this guides,
          I started my journey as a Fullstack developer, doing Backend development with Flask and Django (learning Express too), and Frontend with React.js.
        </Text>
        <Text>
          At this stage of my learning path, I'm feeling ready to get my first tech job. I know that as a first experience I will be learning a lot, but in the
          other hand, I'm sure that I will be put all my efforts to add value to the company that gives me that first job...
        </Text>
        {/* <ContactButton /> */}
      </AboutWrapper>        
    </SectionContainer>
  )
}

export default About
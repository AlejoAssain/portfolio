import SectionContainer from "../SectionContainer";
import styled from "styled-components"
import { motion } from "framer-motion";
import rocket from "./rocket.svg"


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
          Hola! Soy un desarrollador de software de 21 años. Vivo en Córdoba, Argentina. Comencé a programar a los 17 años y en ese momento me convertí en fan de crear tecnología. Además, desde 2018, curso la carrera de Ing. en Sistemas de Información en la Universidad Tecnológica Nacional.
        </Text>
        <Text>
          En mi carrera aprendí a programar con Python y en 2021 decidí empezar a aplicar mis conocimientos al desarrollo web. Empecé aprendiendo HTML y CSS, además aprendí Flask para hacer Backend. Tenía conocimientos previos de SQL, así que utilizando SQLAlchemy, aprendí a manejar bases de datos desde el Backend.
        </Text>
        <Text>
          Actualmente me considero capaz de realizar ambas partes del desarrollo y me encuentro buscando mi primer trabajo dentro del área de TI...
        </Text>
      </AboutWrapper>        
    </SectionContainer>
  )
}

export default About

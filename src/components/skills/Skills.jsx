import SectionContainer from "../SectionContainer";
import styled from "styled-components";
import { motion } from "framer-motion";
import reactLogo from "./reactLogo.svg"
import pythonLogo from "./pythonLogo.svg"
import { useLanguage } from "../../useLanguage";
import applicationTexts from "../../static/applicationTexts";

const SkillsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 750px) {
    flex-direction: column;
    margin: 20px;
  }
`

const Box = styled(motion.div)`
  margin: 0;
  border: 2px solid ${ ({theme}) => theme.text};
  border-radius: 50px;
  height: 50vh;
  min-height: 440px;
  min-width: 290px;
  max-width: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 100px;
  &.skills-be {
    margin-right: 4vw;
    margin-left: 1vw;
    @media (max-width: 750px) {
      margin: 0;
      margin-top: 100px;
      
    }
  }
  &.skills-fe {
    margin-left: 4vw;
    margin-right: 1vw;
    @media (max-width: 750px) {
      margin: 0;
      margin-top: 200px;
      margin-bottom: 150px;
    }
  }
`

const SkillsBox = ({children, className}) => {
  return (
    <Box
      className={className}
      whileHover={{
        scale: 1.1
      }}
    >
      {children}
    </Box>)
}

const Text = styled.div`
  display: block;
  padding: 5px;
  &.skills-title {
    align-self: center;
    font-size: 25px;
    font-weight: 600;
    padding-top: 40px;
    padding-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .python-logo {
    margin-right: 20px;
  }
  &.skills-subtitle {
    font-size: 20px;
    padding-bottom: 120px;
  }
  &.skills-section-sub {
    font-size: 20px;
    font-weight: 600;
    padding-bottom: 30px;
    
  }
  &.skills-section-desc {
    font-size: 20px;
    line-height: 30px;
    padding-bottom: 30px;
  }
`

const SectionLogo = ({src, logoName, className}) => {
  return (  
    <motion.img
      className={className}
      style={{
        display: "inline",
        height: (logoName === "python") ? "60px" : "60px",
      }}
      src={src}
      animate={{
        rotate: 360,
      }}
      transition={{
        ease: "linear",
        duration: 6,
        repeat: Infinity
      }}
    />         
  )
}

const Skills = () => {
  const { language } = useLanguage()

  return (
    <SectionContainer>
      <SkillsWrapper>
        <SkillsBox className="skills-be">          
          <Text className="skills-title">
            <SectionLogo className="python-logo" logoNama="python" src={pythonLogo} />
            { applicationTexts[language].skills.be.title }
          </Text>
          <Text className="skills-subtitle">
            { applicationTexts[language].skills.be.text }
          </Text>
          <Text className="skills-section-sub">
            { applicationTexts[language].skills.be.skillsTitle }
          </Text>
          <Text className="skills-section-desc">
            { applicationTexts[language].skills.be.skillsDescription }
          </Text>
        </SkillsBox>
        <SkillsBox className="skills-fe">
          <Text className="skills-title">
            <SectionLogo logoNama="react" src={reactLogo}/>              
            { applicationTexts[language].skills.fe.title }
          </Text>
          <Text className="skills-subtitle">
            { applicationTexts[language].skills.fe.text }
          </Text>
          <Text className="skills-section-sub">
            { applicationTexts[language].skills.fe.skillsTitle }
          </Text>
          <Text className="skills-section-desc">
            { applicationTexts[language].skills.fe.skillsDescription }
          </Text>
        </SkillsBox>
      </SkillsWrapper>
    </SectionContainer>
  );
}

export default Skills;

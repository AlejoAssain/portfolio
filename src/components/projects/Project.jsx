import styled from "styled-components";
import { motion } from "framer-motion"
import { useLanguage } from "../../useLanguage";
import applicationTexts from "../../static/applicationTexts";
import { BsGithub } from "react-icons/bs"

const ProjectWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border: 2px solid ${ ({theme}) => theme.text};
  border-radius: 40px;
  width: 350px;
  overflow: hidden;
  user-select: none;
`

const Title = styled.div`
  width: 100%;
  
  font-size: 30px; 
  margin-top: 25px;
  margin-bottom: 20px;
  padding: 0 10px;
  padding-bottom: 15px;
  
  border-bottom: 2px solid ${ ({theme}) => theme.text };
`

const Description = styled.div`
  font-size: 15px;
  margin-bottom: 30px;
  padding: 0 10px;
`

const VisitButton = styled(motion.button)`
  border: 2px solid ${ ({theme}) => theme.text };
  background-color: ${ ({theme}) => theme.text};
  color: ${ ({theme}) => theme.bg};
  font-size: 20px;
  align-self: flex-end;
  padding: 8px 13px;
  margin-right: 30px;
  margin-bottom: 20px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
`

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`


const GitHubButton = styled(motion.div)`
  margin-left: 30px;
  margin-bottom: 20px;
`

const Project = ({title, description, url, gitHubUrl}) => {
  const { language } = useLanguage()

  return (       
    <ProjectWrapper
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      key={title}
    >
      <Title>
        {title}
      </Title>
      <Description>
        {description}
      </Description>
      <ButtonsWrapper>
        <GitHubButton
          onClick={ () => {
            window.open(gitHubUrl)
          }}
        >
          <BsGithub size={ "2rem" } />
        </GitHubButton>
        <VisitButton
          onClick={ () => {
            window.open(url)
          }}
        >
          { applicationTexts[language].projects.buttonText }
        </VisitButton>
      </ButtonsWrapper>
    </ProjectWrapper>
  );
}

export default Project;

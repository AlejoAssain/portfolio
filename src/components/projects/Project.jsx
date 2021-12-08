import styled from "styled-components";
import { motion } from "framer-motion"

const ProjectWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border: 2px solid ${ ({theme}) => theme.text};
  border-radius: 40px;
  width: 350px;
  overflow: hidden;
`

const ProjectImage = styled.img`
  display: block;
  width: 350px;
  margin-bottom: 20px;
`

const Title = styled.div`
  font-size: 23px; 
  margin-bottom: 20px;
  padding: 0 10px;
`

const Description = styled.div`
  font-size: 15px;
  margin-bottom: 30px;
  padding: 0 10px;
`

const VisitButton = styled.button`
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
`

const Project = ({title, description, url, image}) => {
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
      <ProjectImage src={image} />
      <Title>
        {title}
      </Title>
      <Description>
        {description}
      </Description>
      <VisitButton
        onClick={ () => {
          window.open(url)
        }}
      >
        Visitar
      </VisitButton>
    </ProjectWrapper>
  );
}

export default Project;

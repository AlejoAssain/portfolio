import styled from "styled-components";

import ArrowContainer from "./ArrowContainer";

const ProjectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border: 2px solid #fff;
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

const GoButton = styled.button`
  font-size: 20px;
  align-self: flex-end;
  padding: 8px 13px;
  margin-right: 30px;
  margin-bottom: 20px;
`

const Project = ({title, description, url, image}) => {
  return (
          
    <ProjectWrapper>
      <ProjectImage src={image} />
      <Title>
        {title}
      </Title>
      <Description>
        {description}
      </Description>
      <GoButton
        onClick={ () => {
          window.open(url)
        }}
      >
        Visit
      </GoButton>
    </ProjectWrapper>
  );
}

export default Project;

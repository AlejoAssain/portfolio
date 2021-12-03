import styled from "styled-components";
import SectionContainer from "../SectionContainer";
import Project from "./Project";
import blogImage from "./projectsImg/blogProject.png"
import { useState } from "react"
import ArrowContainer from "./ArrowContainer";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi"

// const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const ProjectsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
`
const projectsData = [
  {
    title: "My Personal Blog",
    description: "My personal blog made with Flask that implements interesting functionalities like authentication, a database with PostgresSQL and more",
    url: "https://alejo-blog.herokuapp.com/",
    image: blogImage
  },
]

const Projects = () => {

  const [projectNumber, setProjectNumber] = useState(0)

  const nextProject = () => {
    setProjectNumber(projectNumber + 1)
  }

  return (
    <SectionContainer>
      <ProjectsWrapper>              
        <ArrowContainer onClick={nextProject}>
          <FiArrowLeft />          
        </ArrowContainer>
        <Project
          title={projectsData[projectNumber].title}
          description={projectsData[projectNumber].description}
          url={projectsData[projectNumber].url}
          image={projectsData[projectNumber].image}
        />        
        <ArrowContainer onClick={nextProject}>
          <FiArrowRight />          
        </ArrowContainer>
      </ProjectsWrapper>
    </SectionContainer>
  );
}

export default Projects;

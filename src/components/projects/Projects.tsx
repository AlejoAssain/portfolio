import styled from "styled-components";
import SectionContainer from "../SectionContainer.js";
import { AnimatePresence } from "framer-motion";
import Project from "./Project";
import { useState } from "react"
import ArrowContainer from "./ArrowContainer";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi"
import { useLanguage } from "../../providers";
import { projectsData } from "./projectsData";


const randomIntFromInterval = (
  min: number,
  max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const ProjectsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
`

export const Projects = () => {
  const { language } = useLanguage()
  
  const [projectNumber, setProjectNumber] = useState(randomIntFromInterval(0, projectsData.length - 1))

  const prevProject = () => {
    if (projectNumber > 0) {
      setProjectNumber(projectNumber - 1)
    } else {
      setProjectNumber(projectsData.length - 1)
    }
  }

  const nextProject = () => {
    if (projectNumber < (projectsData.length - 1)) {
      setProjectNumber(projectNumber + 1)
    } else {
      setProjectNumber(0)
    }
  }

  return (
    <SectionContainer>
      <ProjectsWrapper>              
        <ArrowContainer onClick={prevProject}>
          <FiArrowLeft />          
        </ArrowContainer>
        <AnimatePresence>
          <Project
            title={ projectsData[projectNumber].title }
            description={
              language === 'en' ? projectsData[projectNumber].description[language] :
                projectsData[projectNumber].description['es']
            }
            url={ projectsData[projectNumber].url }
            gitHubUrl={ projectsData[projectNumber].gitHubUrl }
          />        
        </AnimatePresence>
        <ArrowContainer onClick={nextProject}>
          <FiArrowRight />          
        </ArrowContainer>
      </ProjectsWrapper>
    </SectionContainer>
  );
}

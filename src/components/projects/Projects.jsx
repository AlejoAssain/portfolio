import styled from "styled-components";
import SectionContainer from "../SectionContainer";
import { AnimatePresence } from "framer-motion";
import Project from "./Project";
import { useState } from "react"
import ArrowContainer from "./ArrowContainer";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi"

// images
import blogImg from "./projectsImg/blogProject.png"
import cartAppImg from "./projectsImg/cartProject.png"
import notesAppImg from "./projectsImg/notesProject.png"

const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

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
    description: "Este es mi blog personal, hecho con Flask. Acá implementé algunas tecnologías interesantes como autenticación, una BD con PostgreSQL y más",
    url: "https://alejo-blog.herokuapp.com/",
    image: blogImg
  },
  {
    title: "Shopping Cart App",
    description: "Esta aplicación fue desarrollada con React.js y me sirvió para poner en práctica los hooks de React. Simula el funcionamiento de un carrito de compras",
    url: "https://alejo-shopping-cart.vercel.app/",
    image: cartAppImg
  },
  {
    title: "Notes App",
    description: "Aplicación desarrollada con React.js. Me sirvió para practicar manejo de estado en React atraves de hooks",
    url: "https://alejo-notes-app.vercel.app/",
    image: notesAppImg
  },
]

const Projects = () => {

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
            title={projectsData[projectNumber].title}
            description={projectsData[projectNumber].description}
            url={projectsData[projectNumber].url}
            image={projectsData[projectNumber].image}
          />        
        </AnimatePresence>
        <ArrowContainer onClick={nextProject}>
          <FiArrowRight />          
        </ArrowContainer>
      </ProjectsWrapper>
    </SectionContainer>
  );
}

export default Projects;

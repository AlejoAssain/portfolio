import { motion } from "framer-motion";
import styled from "styled-components";
import { useLocation } from "react-router-dom"

const Section = styled(motion.div)`
  box-sizing: border-box ;
  padding: 0;
  margin: 0;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: color 1s;
`

const animations = (enterDirection) => {
  return {
    initial: {
      x: (enterDirection === "left") ? "-100vw" : (enterDirection === "right") ? "100vw" : 0,
      opacity: 0
    },
    animate: {
      x: 0,
      opacity: 1
    },
    transition: {
      duration: 0.6
    },
    exit: {
      opacity: 0,
    }
  }
}

const getAnimation = (currentPath, previousPath) => {
  let enterDirection
  if (previousPath) {
    if (currentPath === "/") {
      enterDirection = "left"

    } else if (currentPath === "/skills") {
      if (previousPath === "/") {
        enterDirection = "right"
      } else {
        enterDirection = "left"
      }
    
    } else if (currentPath === "/projects") {
      if (previousPath === "/skills") {
        enterDirection = "right"
      } else {
        enterDirection = "left"
      }
    } else if (currentPath === "/about") {
      enterDirection = "right"
    }
  }
  return animations(enterDirection)
}

const SectionContainer = (props) => {

  const location = useLocation()

  const currentAnimation = getAnimation(location.pathname, location.state)
  
  return (
    <Section
      className="section-container"
      initial={currentAnimation.initial}
      animate={currentAnimation.animate}
      exit={currentAnimation.exit}
      transition={currentAnimation.transition}
    >
      {props.children}
    </Section>
  )
}
export default SectionContainer
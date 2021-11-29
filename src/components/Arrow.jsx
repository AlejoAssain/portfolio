import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { motion } from "framer-motion"
import styled from "styled-components"
import { useLocation } from "react-router-dom"

const ArrowContainer = styled(motion.div)`
  position: fixed;
  &.arrow-left {
    left: 2vw;
  }
  &.arrow-right {
    right: 2vw;
  }
  & * {
    font-size: 30px;
  }
`

const Arrow = ({direction}) => {

  const location = useLocation()

  return (
    <>
      { (direction === "left" && location.pathname !== "/") 
        ? <ArrowContainer 
            className="arrow-left"
            whileHover={{
              scale: 1.3
            }}
            whileTap={{
              scale: 0.9
            }}
          >
            <FaArrowLeft />
          </ArrowContainer>
        : (location.pathname !== "/about") ?
          <ArrowContainer 
            className="arrow-right"
            whileHover={{
              x: 0,
              scale: 1.3
            }}
            whileTap={{
              scale: 0.9
            }}
          >
            <FaArrowRight />
          </ArrowContainer>
        : null
      }
    </>
  );
}

export default Arrow;

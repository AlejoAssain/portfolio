import { motion } from "framer-motion"
import styled from "styled-components"

const Container = styled(motion.div)`
  margin: 1vw;
  font-size: 25px;
`

const ArrowContainer = ({children, onClick}) => {
  return (
    <Container
      whileHover={{
        scale: 1.1
      }}
      onClick={onClick}
    >
      {children}
    </Container>
  );
}

export default ArrowContainer;

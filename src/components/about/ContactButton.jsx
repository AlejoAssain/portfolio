import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const ButtonContainer = styled(motion.button)`
  max-width: 300px;
  align-self: center;
  margin-bottom: 30px;
  font-size: 20px;
  padding: 15px;
  border-radius: 20px;
  background-color: ${ ({theme}) => theme.text};
  color: ${ ({theme}) => (theme.themeName === "dark") ? "#000" : "#fff"};
  transition: color 1s;
  transition: background-color 1s;
`

const ContactButton = () => {

  const navigate = useNavigate()

  return (
    <ButtonContainer
      whileHover={{
        scale: 1.1
      }}
      whileTap={{
        scale: 0.9
      }}
      onClick={() => {navigate("/contact")}}
    >
      Contact Me!
    </ButtonContainer>
  );
}

export default ContactButton;

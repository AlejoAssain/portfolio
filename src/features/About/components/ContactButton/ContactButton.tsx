import { useNavigate } from 'react-router';

import { ButtonContainer } from './ContactButton.styles.ts';

// TODO - create reusable buttons
export const ContactButton = () => {
  const navigate = useNavigate();

  return (
    <ButtonContainer
      whileHover={{
        scale: 1.1,
      }}
      whileTap={{
        scale: 0.9,
      }}
      onClick={() => {
        navigate('/contact');
      }}
    >
      Contact Me!
    </ButtonContainer>
  );
};

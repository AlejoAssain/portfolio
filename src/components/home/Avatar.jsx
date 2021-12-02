import avatar from "./img/MyAvatar.png"
import styled from "styled-components";

const AvatarContainer = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 2px solid ${ ({theme}) => theme.text};
  padding-left: 4vw;

  @media (max-width: 750px) {
    border: none;
  }
`

const AvatarImage = styled.img`
  height: 50vh;
  width: auto;
  @media (max-width: 750px) {
    max-height: 40vh;
  }

`

const Avatar = () => {
  return (
    <AvatarContainer className="avatar-container">
      <AvatarImage src={avatar}/>     
    </AvatarContainer>
  );
}

export default Avatar

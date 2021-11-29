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
`

const AvatarImage = styled.img`
  height: 50vh;
  width: auto;
`

const Avatar = () => {
  return (
    <AvatarContainer className="avatar-container">
      <AvatarImage src={avatar}/>     
    </AvatarContainer>
  );
}

export default Avatar

import styled from "styled-components"

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  height: 100%;
  width: 100%;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  color: ${ ({theme}) => theme.text };
  /* background-color: ${ ({theme}) => theme.bg }; */
  overflow-x: hidden;
  z-index: 10;
`

export default Container
import styled from "styled-components"  


export const ErrorContainer = styled.div`
  min-height: 40px;
  margin-top: 0.5vh;
  font-size: 1.6vh;
  color: #f66;
`
export const FormLabel = styled.div`
  margin: 2vh 0;
  font-size: 2vh;
`
export const FieldContainer = styled.div`
  & * {
    background-color: ${ ({theme}) => theme.text};
    color: ${ ({theme}) => theme.bg};
    font-size: 2vh;
    padding: 3px;
    min-width: 31vw;
    max-width: 400px;
  }

  & textarea {
    min-height: 10vh;
  }
`
export const SubmitButton = styled.button`
  align-self: flex-end;
  background-color: ${ ({theme}) => theme.text};
  color: ${ ({theme}) => theme.bg};
  padding: 5px;
  border-radius: 5px;
`
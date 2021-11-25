import styled from "styled-components"

export const SwitchWrapper = styled.div`
  margin-left: 7px;
  margin-right: 10px;
  position: relative;
  display: inline;
  width: 60px;
  height: 34px;
  border-radius: 20px;
  background-color: ${ ({theme}) => theme.sliderBg };
  z-index: 85;
`

export const SwitchInput = styled.div`
  opacity: 0;
  width: 0;
  height: 0;
`
export const SwitchSlider = styled.div`
  position: absolute;
  cursor: pointer;
  height: 26px;
  width: 26px;
  top: 4px;
  bottom: 4px;  
  left: ${ ({theme}) => (theme.themeName === "light") ? "4px" : "30px"};;
  right: 0;
  background-color: ${ ({theme}) => theme.sliderText };
  z-index: 90;
  border-radius: 50%;
`

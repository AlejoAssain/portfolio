import { SwitchWrapper, SwitchInput, SwitchSlider } from "./Switch-components"

const Switch = ({changeTheme}) => {
  return (
    <SwitchWrapper>
      <SwitchInput />
      <SwitchSlider 
        onClick={changeTheme} 
        initial={{
          
        }}
      />
    </SwitchWrapper>
  )
}

export default Switch
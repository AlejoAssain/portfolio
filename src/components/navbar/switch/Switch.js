import { SwitchWrapper, SwitchInput, SwitchSlider } from "./Switch-components"

const Switch = ({changeTheme}) => {
  return (
    <SwitchWrapper>
      <SwitchInput />
      <SwitchSlider onClick={changeTheme} />
    </SwitchWrapper>
  )
}

export default Switch
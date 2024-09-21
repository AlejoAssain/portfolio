import {
  SwitchWrapper,
  SwitchInput,
  SwitchSlider,
} from './Switch-components.js';

interface Props {
  changeTheme: () => void;
}

export const Switch = ({ changeTheme }: Props) => {
  return (
    <SwitchWrapper>
      <SwitchInput />
      <SwitchSlider onClick={changeTheme} initial={{}} />
    </SwitchWrapper>
  );
};

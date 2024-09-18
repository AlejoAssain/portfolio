import styled from 'styled-components';
import { useLanguage } from '../../providers';
import { applicationTexts } from '../../static/applicationTexts.ts';


const Text = styled.div`
  max-width: 100%;
  max-height: 100%;
  box-sizing: content-box;
  font-size: 2rem;
  
  &.home-box-title {
    font-size: 5vh;
    font-weight: 600;
    margin-bottom: 10px;
  }
  &.home-box-subtitle {
    font-size: 3vh;
    font-weight: 500;
    margin: 20px 0px;
  }
  &.home-box-desc {
    font-size: 2vh;
    font-weight: 300;
    margin-top: 10px;
  }
`

const DescriptionContainer = styled.div`
  max-width: 45vw;
  padding-right: 2vw;
  text-align: end;
`

export const DescriptionBox = () => {
  const { language } = useLanguage();

  const descriptionTexts = language === 'en' ? applicationTexts[language].descriptionBox :
    applicationTexts['es'].descriptionBox;

  return (
    <DescriptionContainer>
      <Text className="home-box-title">
        { descriptionTexts.title }
      </Text>
      <Text className="home-box-subtitle">
        { descriptionTexts.subtitle }
      </Text>
      <Text className="home-box-desc">
        { descriptionTexts.text }
      </Text>
    </DescriptionContainer>
  )
}

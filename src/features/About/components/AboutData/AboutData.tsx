import { useLanguage } from '../../../../providers';
import { applicationTexts } from '../../../../static/applicationTexts';
import { AboutDataContainer, AboutDataText } from './AboutData.styles.ts';

export const AboutData = () => {
  const { language } = useLanguage();

  return (
    <AboutDataContainer
      whileHover={{
        scale: 1.03,
      }}
    >
      <AboutDataText>
        {language === 'en'
          ? applicationTexts[language].aboutMe.text1
          : applicationTexts['es'].aboutMe.text1}
      </AboutDataText>
      <AboutDataText>
        {language === 'en'
          ? applicationTexts[language].aboutMe.text2
          : applicationTexts['es'].aboutMe.text2}
      </AboutDataText>
      <AboutDataText>
        {language === 'en'
          ? applicationTexts[language].aboutMe.text3
          : applicationTexts['es'].aboutMe.text3}
      </AboutDataText>
    </AboutDataContainer>
  );
};

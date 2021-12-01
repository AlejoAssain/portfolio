// import styled from "styled-components";
import SectionContainer from "../SectionContainer";
import styled from "styled-components"

const AboutWrapper = styled.div`
  margin: 0 5vw;
  margin-left: 20vw;
  margin-top: 68px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #fff;
`

const Text = styled.div`
  max-width: 70vw;
  padding: 40px;
  font-size: 2.8vh;
`

const About = () => {
  return (
    <SectionContainer>
      <AboutWrapper>
        <Text>
          I'm a 21 years old Software Developer from Córdoba, Argentina. I've been learning the basics of the Software Engenieering for the last
          3 years, by myself and in Systems Engineering career at Universidad Tecnológica Nacional - Facultad Regional Córdoba.
        </Text>
        <Text>
          In 2021 I decided to put myself 100% on learning web development. So I started taking some courses, like "100 Days of Code: The Complete
          Python Pro Bootcamp for 2022" and "React - Definitive guide: Hooks Router Redux Next", with the basics that I generated with this guides,
          I started my journey as a Fullstack developer, doing Backend development with Flask and Django (learning Express too), and Frontend with React.js.
        </Text>
        <Text>
          At this stage of my learning path, I'm feeling ready to get my first tech job. I know that as a first experience I will be learning a lot, but in the
          other hand, I'm sure that I will be put all my efforts to add value to the company that gives me that first job...
        </Text>
        </AboutWrapper>
    </SectionContainer>
  )
}

export default About
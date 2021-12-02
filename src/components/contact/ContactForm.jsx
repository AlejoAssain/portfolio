import styled from "styled-components"
import SectionContainer from "../SectionContainer"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as yup from "yup"

const errorMessages = {
  userName: {
    required: "The name is required",
    min: "The name is too short",
    max: "The name is too long"
  },
  email: {
    required: "The email is required",
    email: "The email is not valid",
    max: "The email is too long"
  },
  message: {
    required: "The message is required",
    min: "The message is too short",
    max: "The message is too long"
  }
}

const contactFormSchema = yup.object().shape({
  userName: yup.string().min(3, errorMessages.userName.min).max(50, errorMessages.userName.max).required(errorMessages.userName.required),
  email: yup.string().email(errorMessages.email.email).max(70, errorMessages.email.max).required(errorMessages.email.required),
  message: yup.string().min(10, errorMessages.message.min).max(350, errorMessages.message.max).required(errorMessages.message.required)
})

const FormikForm = styled(Formik)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border: 1px solid #fff;
`

const FormWrapper = styled.div`
  border: 2px solid #fff;
  border-radius: 30px;
  padding: 32px;

`

const ErrorContainer = styled.div`
  min-height: 40px;
  margin-top: 10px;
  font-size: 1.6vh;
  color: #f66;
`

const FormLabel = styled.div`
  margin: 15px 0;
  font-size: 2vh;
`

const FieldContainer = styled.div`
  & * {
    background-color: ${ ({theme}) => theme.text};
    color: ${ ({theme}) => theme.bg};
    font-size: 1.8vh;
    padding: 3px;
    min-width: 31vw;
    max-width: 400px;

  }

  & textarea {
    min-height: 150px;
  }
`

const ContactForm = () => {
  return (
    <SectionContainer>
      <FormikForm        
        initialValues={{
          userName:"",
          email:"",
          message:""
        }}
        validationSchema={contactFormSchema}
        onSubmit={(values) => console.log(values)}
      >
        <FormWrapper>
          <Form>
            <FormLabel>Name</FormLabel>
            <FieldContainer>
              <Field type="text" name="userName" />
            </FieldContainer>
            <ErrorContainer>
              <ErrorMessage name="userName" />
            </ErrorContainer>

            <FormLabel>Email</FormLabel>          
            <FieldContainer>
              <Field type="text" name="email" />
            </FieldContainer>
            <ErrorContainer>
              <ErrorMessage name="email" />
            </ErrorContainer>

            <FormLabel>Message</FormLabel> 
            <FieldContainer>
              <Field as="textarea" type="text" name="message" />
            </FieldContainer>
            <ErrorContainer>
              <ErrorMessage name="message" />
            </ErrorContainer>
            <button type="submit">Submit</button>
          </Form>
        </FormWrapper>
      </FormikForm>
    </SectionContainer>
  );
}


export default ContactForm;

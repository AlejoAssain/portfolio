import SectionContainer from "../SectionContainer"
import { Formik, Form, Field, ErrorMessage } from "formik"
import contactFormSchema from "./ValidationData"
import { ErrorContainer , FormLabel, FieldContainer, SubmitButton } from "./ContactForm-components"

const ContactForm = () => {
  return (
    <SectionContainer>
      <Formik        
        initialValues={{
          userName:"",
          email:"",
          message:""
        }}
        validationSchema={contactFormSchema}
        onSubmit={(values) => console.log(values)}
      >
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "30px",
            padding: "32px",
            minHeight: "245px",
            maxHeight: "65vh",         
          }}
        >
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
          <SubmitButton type="submit">Submit</SubmitButton>
        </Form>
      </Formik>
    </SectionContainer>
  );
}

export default ContactForm;

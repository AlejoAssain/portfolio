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

export default contactFormSchema

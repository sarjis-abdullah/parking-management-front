import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email is not valid")
    .required((data) => `${data.path} is required`),
  role: yup
    .string()
    .required((data) => `${data.path} is required`),
  password: yup
    .string()
    .min(5, (data) => `Password minimum ${data.min} characters long`)
    .required((data) => `${data.label} is required`)
    .label("Password"),
  confirmPassword: yup
    .string()
    .min(5, (data) => `Password minimum ${data.min} characters long`)
    .required((data) => `Confirm password is required`)
    .oneOf([yup.ref("password"), null], 'Does not match with password'),
});

export default schema
import * as Yup from 'yup'


export interface FormValues {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  export interface initialValues {
    userName: "";
    email: "";
    password: "";
    confirmPassword: "";
  }

  export const validationSchema=Yup.object({
    userName:Yup.string()
    .trim()
    .max(20,"UserName must be at most 20 characters")
    .required("userName is required"),
    email:Yup.string()
    .required("Email is required"),
    password:Yup.string()
    .min(8,"password must be at least 8 characters")
    .matches( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    .required("password is required"),
    confirmPassword:Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  });
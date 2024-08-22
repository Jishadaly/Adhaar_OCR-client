import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FormValues,validationSchema } from '../utils/Validation/SignUpValidation';
import { useNavigate } from "react-router-dom"
import {toast} from 'sonner';
import TextError from '../Components/TextError';
import { logged } from '../utils/context/Reducers/authSlice'
import { Formik, Form, Field, ErrorMessage} from 'formik';
import { postRegister } from '../services/apiMethods';



const SignUp: React.FC = () => {


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || '';
  const [userEmail, _setUserEmail] = useState(email);

  const initialValues: FormValues = {
    userName: "",
    email: userEmail,
    password: "",
    confirmPassword: "",
  };

  const navigate=useNavigate();

  const selectUser = (state: any) => state.auth.user;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (email.length !== 0) {
      initialValues.email = userEmail;
    }
  }, [initialValues, userEmail]);
  
  const handleSubmit = (values: FormValues) => {
    postRegister(values)
      .then((response: any) => {
        if (response.status === 200) {
          navigate('/otp')
          console.log(response,"register");
          
          toast.success(response.data.message)
        } else {
          toast.error(response.message)
        }
      })
      .catch((error: Error) => {
        console.log(error?.message);
      });
  };
  
  useEffect(() => {
   

    if (user) {
      navigate('/home')
    }

   
  }, [user, navigate])


  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full border border-blue-200">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Sign Up
        </h2>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              {/* User Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="userName">
                  Full Name
                </label>
                <Field
                  type="text"
                  id="userName"
                  name="userName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your full name"
                />
                <TextError>
                  <ErrorMessage name="userName" />
                </TextError>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                />
                <TextError>
                  <ErrorMessage name="email" />
                </TextError>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Create a password"
                />
                <TextError>
                  <ErrorMessage name="password" />
                </TextError>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Confirm your password"
                />
                <TextError>
                  <ErrorMessage name="confirmPassword" />
                </TextError>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-yellow-400 text-blue-800 py-2 px-4 rounded-md hover:bg-yellow-300 transition duration-300 font-semibold"
              >
                Sign Up
              </button>
            </Form>
          )}
        </Formik>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

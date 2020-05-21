import React from 'react';
import * as yup from 'yup';

const formSchema = yup.object().shape({
    name: yup
    .string()
    .min(2, 'Name must have at least 2 characters')
    .required('Name is required!'),
  
    email: yup
    .string()
    .email('A valid email is required!')
    .required('Email is required'),
  
    civil: yup
    .string()
    .matches(/(married|single)/, 'Either single or married')
    .required('civil status is required'),
    
    password: yup
    .string()
    .min(6, 'Password must have at least 6 characters')
    .required('Password is required'),
    
    termsOfService: yup
    .boolean()
    .oneOf ([true], "You must accept Terms Of Service")
  })

export default formSchema;
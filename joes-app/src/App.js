import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import * as yup from 'yup';

import Form from './Form';
import formSchema from './FormSchema';
import User from './User';

//THIS IS THE URL FOR OUT GET AND POST REQUESTS
const url= 'https://reqres.in/api/users'

//SHAPE THAT DRIVES STATE OF FORM
const initialFormValues = [
  {
    name:'',
    email:'',
    password:'',
    civil: '',
    termsOfService: false
}
];

//SHAPE OF VALIDATION ERRORS OBJECT
const initialFormErrors = {
  name:'',
  email:'',
  password: '',
  civil:'',
  }

  //********YOUR ACTUAL APPLICATION******** */
function App() {
  
  const [user, setUser] = useState([])
  const [formValues, setFormValues] = useState(initialFormValues)
  
  //STATE KEEPS TRACK OF IF SUBMIT BUTTON IS DISABLED OR NOT
  const [formDisabled, setFormDisabled] = useState(true)
  
  //STATE NEEDS TO KEEP TRACK OF VALIDATION ERRORS
  const [formErrors, setFormErrors] = useState(initialFormErrors)

  // FETCH YOUR USERS FROM API AND SET THEM IN STATE
  const getUsers = () => {
    axios.get(url)
    .then(function(res) {
      console.log(res);
      setUser([...user, res.data])
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  //AFTER FIRST "DOM SURGERY" WE NEED TO GET OUR USERS FROM API
  useEffect(() =>{
    getUsers()
    }, [])

    // WE NEED A FUNCTION TO ADD A NEW USER TO API
    // AND SET AN UPDATED LIST OF USERS IN STATE
    const postUser = users => {
      axios.post(url, user)
      .then(res => {
        setUser([...users, res.data])
      })
      .catch(err => {
      })
    }

    // IF FORM IS CHANGED WE NEED TO RUN VALIDATION
    // AND USE CHANGES TO ENABLE/DISABLE SUBMIT BUTTON
    useEffect(() => {
      formSchema.isValid(formValues)
        .then(valid => { 
          setFormDisabled(!valid)
        })
    }, [formValues])

    const onSubmit = evt => {
      evt.preventDefault()
    
    
        const newUser = {
        name: formValues.name,
        email: formValues.email,
        civil: formValues.civil === 'single' ? false : true,
        password: formValues.password,
        termsOfService: Object.keys(formValues.termsOfService)
        .filter(termsOfService => formValues.termsOfService[termsOfService] ===true)
        }
    
    
        // WE NEED TO POST OUR NEW USER TO THE API AND SET OUR FORM BACK TO NORMAL
        postUser(newUser)
        setFormValues(initialFormValues)
    }

    // INPUT CHANGE
    const onInputChange = evt => {
      const name = evt.target.name
      const value = evt.target.value
    
    
      // IF THE FORM VALUES CHANGE, WE NEED TO RUN VALIDATION
      // AND UPDATE ERRORS SLICE OF STATE (SO FORM CAN DISPLAY ERRORS)
    
      yup
      .reach(formSchema, name)
      .validate(value)
      .then(valid => {
    setFormErrors({
      //"HAPPY PATH" WILL CLEAR ERROR AND "SET IT BACK"... VALIDATES!
      ...formErrors,
      [name]:'',
    })
      })
      .catch(err => {
        //"SAD PATH" 
        setFormErrors({
          ...formErrors,
          [name]: err.errors[0],
        })
      })
    
      setFormValues({
        ...formValues,
        [name]:value
      })
    }
    
    // CHECKBOX
    const onCheckBoxChange = evt => {
      const {termsOfService} = evt.target
      const isChecked = evt.target.checked
    
      setFormValues({
        ...formValues,
        termsOfService: {
    ...formValues.termsOfService,
      [true]: isChecked,
        }
      })
    }

  return (
    <div className="App">
      <Form
      values = {formValues}
      onInputChange = {onInputChange}
      onCheckBoxChange = {onCheckBoxChange}
      onSubmit = {onSubmit}
      disabled ={formDisabled}
      errors ={formErrors}
      />

{
        user.map(user => {
          return (  
            <User key={user.id} details={user} />
          )
        })
      }
    </div>
  );
}

export default App;

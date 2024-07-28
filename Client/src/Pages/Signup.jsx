import React, { useState } from 'react';
import Form from '../Components/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const fields = ["firstName", "lastName", "email", "password"];
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  const [value, setValue] = useState(initialState);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValue((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:4000/user/signup', {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: value.password
    });
      if (response.status === 200) {
        console.log('User signed up successfully:', response.data);
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        console.error('Error signing up user:', response.data);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.code === 11000) {
        setError('Email already exists. Please choose a different one.');
      } else {
        setError('An error occurred during sign up. Please try again.');
      }
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Form
        label="Sign Up"
        fields={fields}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={value}
        />
        {error && <div className="text-red-500 text-center">{error}</div>}
    </>
  );
}

export default SignUp;

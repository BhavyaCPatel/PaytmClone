import React, { useRef, useState } from 'react';
import Form from '../Components/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const fields = ["email", "password"];
  const [value, setValue] = useState({});
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
    try {
      const response = await axios.post('http://localhost:4000/user/signin', {
          email: value.email,
          password: value.password
      });
      const data = await response.data;
      console.log(response)
      const { token } = response.data;
            localStorage.setItem('authToken', token);
            setValue({
                email: '',
                password: ''
            });
        console.log('User signed in successfully:', data);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Form
        label="Sign In"
        fields={fields}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={value}
      />
    </>
  );
}

export default SignIn;

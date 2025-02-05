import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [message,setMessage] = useState('');
    const [color,setColor] = useState('');
    const navigate = useNavigate();

    const onHandleSubmit = async(e)=>{
        e.preventDefault()
        const user = {
            email:email,
            password:password
        }

        try{
            const res = await api.post('/login/',user);
            localStorage.setItem("accessToken", res.data.access);
            localStorage.setItem("refreshToken", res.data.refresh);
            setMessage('Login Successful');
            setColor('green');
            navigate('/');
      


            }
        catch(e){

            setMessage(e.response.data.error)
            setColor('red')
        }
    }
  return (
    <div>
      <h1>Login Page</h1>
      <p style={{color:color}}>{message}</p>
      <form action="" method="post" onSubmit={onHandleSubmit}>
        <input type="email" name='email' placeholder='Enter Your Email' onChange={(e)=>{setEmail(e.target.value)}} />
        <input type="password" name='password' placeholder='Enter Your Password' onChange={(e)=>{setPassword(e.target.value)}}/>
        <input type="submit" value={"Submit"} />
        <br />
        <Link to={'/register'}>Register</Link> &emsp;
        <Link to={'/'}>Home</Link>
      </form>
    </div>
  )
}

export default Login

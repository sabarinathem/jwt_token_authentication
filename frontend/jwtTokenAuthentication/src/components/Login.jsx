import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import api from '../api';

const Login = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const onHandleSubmit = async(e)=>{
        e.preventDefault()
        const user = {
            email:email,
            password:password
        }

        try{
            const res = await api.post('/login/',user);
            console.log(res.data)
            localStorage.setItem("accessToken", res.data.access);
            localStorage.setItem("refreshToken", res.data.refresh);
            console.log('login successfull')
      


            }
        catch(e){
            console.log(e.message)
        }
    }
  return (
    <div>
      <form action="" method="post" onSubmit={onHandleSubmit}>
        <input type="email" name='email' placeholder='Enter Your Email' onChange={(e)=>{setEmail(e.target.value)}} />
        <input type="password" name='password' placeholder='Enter Your Password' onChange={(e)=>{setPassword(e.target.value)}}/>
        <input type="submit" value={"Submit"} />
      </form>
    </div>
  )
}

export default Login

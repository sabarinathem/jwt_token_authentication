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
            navigate('/products');
      


            }
        catch(e){

            setMessage(e.response.data.error)
            setColor('red')
        }
    }
  return (
    // <div>
    //   <h1>Login Page</h1>
    //   <p style={{color:color}}>{message}</p>
    //   <form action="" method="post" onSubmit={onHandleSubmit}>
    //     <input type="email" name='email' placeholder='Enter Your Email' onChange={(e)=>{setEmail(e.target.value)}} />
    //     <input type="password" name='password' placeholder='Enter Your Password' onChange={(e)=>{setPassword(e.target.value)}}/>
    //     <input type="submit" value={"Submit"} />
    //     <br />
    //     <Link to={'/register'}>Register</Link> &emsp;
    //     <Link to={'/'}>Home</Link>
    //   </form>
    // </div>
    <>
    <main className="min-h-screen w-full flex flex-col lg:flex-row">
       {/* <!-- Right Column - Image --> */}
       <div className="hidden lg:block w-full lg:w-1/2 bg-[#8B6142]">
            <img 
                src="/register_image.jpg"
                alt="Lifestyle image"
                className="w-full h-screen object-fill"
            />
        </div>
        {/* <!-- Left Column - Login Form --> */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-md space-y-8">
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold">Log in to</h1>
                    <h2 className="text-3xl font-bold">Explore</h2>
                </div>
                <p className='text-red-600 text-right'>{message}</p>
                <form className="space-y-6" method="post" onSubmit={onHandleSubmit}>
                    <div className="space-y-2">
                        <label className="block text-sm uppercase text-gray-600 font-medium">
                            Enter your email
                        </label>
                        <input 
                           type="email" 
                           name='email' 
                           placeholder='Enter Your Email' 
                           onChange={(e)=>{setEmail(e.target.value)}}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm uppercase text-gray-600 font-medium">
                                Password
                            </label>
                            <a href="#" className="text-sm text-gray-600 hover:text-[#4A3636]">
                                Forgot your Password?
                            </a>
                        </div>
                        <input 
                            type="password" 
                            name='password' 
                            placeholder='Enter Your Password' 
                            onChange={(e)=>{setPassword(e.target.value)}}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-[#4A3636] text-white py-2 rounded-md hover:bg-[#4A4040] transition-colors duration-200"
                    >
                        LOG IN
                    </button>
                </form>
                {/* Register Link */}
              <div className="text-center">
                <Link to="/register1" className="text-gray-600 hover:text-[#4A3636] text-sm hover:underline">
                Don't have an account? Sign up
                </Link>
              </div>
            </div>
        </div>

       
    </main>
    </>
  )
}

export default Login

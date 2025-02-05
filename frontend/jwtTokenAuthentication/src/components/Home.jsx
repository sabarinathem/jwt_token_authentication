import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

const Home = () => {
    const [isLogin,setIsLogin] = useState(null)
    useEffect(()=>{
      const token = localStorage.getItem('accessToken')
      if (token){
        setIsLogin(true)
      }
    },[])
    const onHandleClick = async()=>{
        try{
            const response = await api.get('/home/');
            console.log(response.data)

        }
        catch(error){
            console.log(error.message)
        }
    }

    const logout = ()=>{
      localStorage.removeItem("accessToken"); 
      const token = localStorage.getItem('accessToken')
      if (token){
        console.log(token)
      }
      else{
        console.log('Access token is removed from the local storage')
      }
      

    }
  return (
    <div>
      <h1>This is Home Page</h1>
      <button onClick={onHandleClick}>Send request</button>
      {isLogin?<button onClick={logout}>Logout</button>:<Link to={"/login"}>Login</Link>}
    </div>
  )
}

export default Home

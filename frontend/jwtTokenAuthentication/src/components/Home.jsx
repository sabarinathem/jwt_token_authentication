import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link, useNavigate } from 'react-router-dom'
import SortDropDown from './SortDropDown/SortDropDown'

const Home = () => {
    const [isLogin,setIsLogin] = useState(null)
    const [user,setUser] = useState({});
    const navigate = useNavigate();
    useEffect(()=>{
      const token = localStorage.getItem('accessToken')
      if (token){
        setIsLogin(true)
      }

      const getUser = async()=>{
        try{
          const res = await api.get('/user-profile/');
          setUser(res.data)
          
        }
        catch(e){
          console.log(e.message)
        }
      }
      getUser()

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
      navigate('/login')
    }
  return (
    <div>
      <h1>Hello {user.first_name} Welcome to website</h1>
      <button onClick={onHandleClick}>Send request</button>&emsp;
      {isLogin?<button onClick={logout}>Logout</button>:<Link to={"/login"}>Login</Link>}
    </div>
  )
}

export default Home

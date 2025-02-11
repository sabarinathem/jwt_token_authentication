import UserIcon from '../Icons/UserIcon'
import React from 'react'
import { Link } from 'react-router-dom'
import CartIcon from '../Icons/CartIcon'
import "boxicons/css/boxicons.min.css"
import HeartIcon from '../Icons/HeartIcon'
import SearchField from '../SearchField/SearchField'
import './Header.css'

const Header1 = () => {
  return (
    <div className='header mh-[200px] bg-gray-300 flex flex-col justify-between px-20 py-8'>
      <div className='top'>
        <span><Link to={'#'}>Contact Us</Link></span>
      </div>
      <div className='middle flex mb-6 relative justify-end'>
        <div className="title absolute left-1/2 transform -translate-x-1/2">
            <h1 className='text-[2rem]'>ELEGANT WARDROBE ★</h1>
        </div>
        <div className="icons-seach-container flex flex-col items-center">
            <div className="icons w-full flex justify-around">
            <UserIcon/>
            <CartIcon/>
            <HeartIcon/>
            </div>
            <div className="search-field">
              <SearchField/>
            </div>
        </div>
      </div>
     
      <div className='bottom'>
        <div className="categories flex justify-between">
            <div className='category'><Link>Men</Link></div>
            <div className='category'><Link>Women</Link></div>
            <div className='category'><Link>Kids</Link></div>
        </div>
      </div>
    </div>
  )
}

export default Header1

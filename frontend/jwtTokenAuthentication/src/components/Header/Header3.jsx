import { Link } from "react-router-dom";
import { Search, User, ShoppingCart, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import api from "@/api";

export default function Header3() {

  const categories = useSelector((state)=>{
    return state.categories
  })
  const dispatch = useDispatch()

  const filterProductByCategories = async(category_id)=>{
    try{
      const res = await api.get(`/filtered_product/?category_id=${category_id}`)
      const {filtered_data} = res.data
      dispatch({type:"set_products",payload:filtered_data})
      dispatch({type:"set_category_id",payload:category_id})
      

    }
    catch(error){
      console.log(error.message)
    }
  }


  return (
    <header className="bg-gray-300 px-4 py-2">
      <div className="container mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-6">
            <Link to="/contact" className="text-sm hover:underline">
              Contact Us
            </Link>
          </nav>

          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="text-xl font-serif">
              ELEGANT WARDROBE★
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-600">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </button>
            <button className="hover:text-gray-600">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </button>
            <button className="hover:text-gray-600">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </button>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="mt-4 flex items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full rounded-md bg-pink-50 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-600">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="mt-4 flex justify-center space-x-8">
          {/* <Link to="/men" className="text-sm hover:underline">
            Men
          </Link>
          <Link to="/women" className="text-sm hover:underline">
            Women
          </Link>
          <Link to="/kids" className="text-sm hover:underline">
            Kids
          </Link> */}
          {categories.map((obj)=>{
            return <button key={obj.id} onClick={()=>{filterProductByCategories(obj.id)}} className="text-sm hover:underline">
            {obj.name}
          </button>
          })}
        </nav>
      </div>
    </header>
  );
}

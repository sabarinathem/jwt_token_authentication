import { Link } from "react-router-dom"
import SortDropDown from "../SortDropDown/SortDropDown"
import { useEffect, useState } from "react"
import api from "@/api"
import { useDispatch, useSelector } from "react-redux"
import LoadingPage from "../LoadingPage/LoadingPage"

export default function ProductsGrid() {
  const dispatch = useDispatch()
  const products = useSelector((state)=>{
    return state.products
  })
  const[loading,setLoading] = useState(false)

  // const [products,setProducts] = useState([])
    useEffect(()=>{
        try{
            const getData = async()=>{
                const res = await api.get('/products/')
                const {product_list,category_list} = res.data
                console.log(product_list)
                console.log(category_list)
                dispatch({type:"set_products",payload:product_list})
                dispatch({type:"set_categories",payload:category_list})
                setLoading(true)
               
            }

            getData()


        }
        catch(error){
            console.log(error.message)
        }
    },[])


  return (
    <div className="container mx-auto px-4 py-8">
      {loading?
      <>
      <div className="sort-dropdown flex justify-end mr-[6rem] mb-5">
        <SortDropDown/>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <Link key={product.id} to={`product/${product.id}`} className="group cursor-pointer">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={`http://127.0.0.1:8000/${product.image }`|| "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-2 space-y-1">
              <h3 className="text-xs uppercase tracking-wider">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>

      </>
      :<LoadingPage/>}
      
      {/* Quick View Modal - You can implement this as needed */}
      {/* Pagination Component - You can implement this as needed */}
    </div>
  )
}
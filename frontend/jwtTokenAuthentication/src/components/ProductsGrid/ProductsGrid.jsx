import { Link } from "react-router-dom"
import SortDropDown from "../SortDropDown/SortDropDown"
import { useEffect, useState } from "react"
import api from "@/api"

export default function ProductsGrid() {

  const [products,setProducts] = useState([])
    useEffect(()=>{
        try{
            const getData = async()=>{
                const res = await api.get('/products/')
                const {product_list} = res.data
                setProducts(product_list)

               
            }

            getData()


        }
        catch(error){
            console.log(error.message)
        }
    },[])
  // Sample product data - in a real app, this would come from an API or props
  // const products = [
  //   {
  //     id: 1,
  //     name: "CPO MELTON WOOL JACKET",
  //     price: "$299",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 2,
  //     name: "OVERSIZED WOOL SWEATER",
  //     price: "$199",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 3,
  //     name: "GG COTTON EMBROIDERED CAP",
  //     price: "$89",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 4,
  //     name: "LOOSE FIT FLANNEL SHIRT",
  //     price: "$159",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 5,
  //     name: "LOOSE FIT PRINTED HOODIE",
  //     price: "$179",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 6,
  //     name: "RELAXED PANTS",
  //     price: "$149",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 7,
  //     name: "REGULAR FIT COTTON SWEATSHIRT",
  //     price: "$129",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 8,
  //     name: "OVERSIZED FIT ZIP-UP SWEATSHIRT",
  //     price: "$169",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 9,
  //     name: "REGULAR FIT TEXTURED SHIRT",
  //     price: "$119",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 10,
  //     name: "REGULAR FIT TEXTURED SHIRT",
  //     price: "$119",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 11,
  //     name: "REGULAR SLIM FIT SHIRT",
  //     price: "$99",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  //   {
  //     id: 12,
  //     name: "EMBROIDERED DENIM HAT",
  //     price: "$79",
  //     image: "/placeholder.svg?height=400&width=300",
  //   },
  // ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="sort-dropdown flex justify-end mr-10 mb-5">
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

      {/* Quick View Modal - You can implement this as needed */}
      {/* Pagination Component - You can implement this as needed */}
    </div>
  )
}
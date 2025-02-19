import { useEffect, useState } from "react"
import { ChevronDown, Filter, Pencil, Trash2 } from "lucide-react"
import api from "@/api"

export default function AdminProductsList() {
  const [selectedDate] = useState("14 Feb 2019")
  const [products,setProducts] = useState([])


  useEffect(()=>{
    try{
      const getProductList = async()=>{
        const res = await api.get("/products/")
        const {product_list} = res.data
        setProducts(product_list)
        console.log(product_list)
      }
      getProductList()
    }
    catch(error){
      console.log(error.message)
    }
  },[])

  const addNewProduct = async()=>{
      try{
        const res = a
      }
      catch(error){

      }
  }
  // const products = [
  //   {
  //     name: "Five sleeve t-shirt",
  //     category: "Men",
  //     price: 120000.0,
  //     place: "12",
  //     status: "Used",
  //   },
  //   {
  //     name: "Wide leg jeans",
  //     category: "Men",
  //     price: 34000.0,
  //     place: "63",
  //     status: "Edit",
  //   },
  //   {
  //     name: "KIDS- Baggy pants",
  //     category: "Kids",
  //     price: 20000.0,
  //     place: "63",
  //     status: "Used",
  //   },
  // ]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter By</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
            {selectedDate}
            <ChevronDown className="w-4 h-4" />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
            <span>Category</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <button 
        onClick={addNewProduct}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
          <span className="text-sm">ADD NEW PRODUCT</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#E8F3F3]">
              <th className="text-left p-4 font-medium">Image</th>
              <th className="text-left p-4 font-medium">Product Name</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium">Piece</th>
              <th className="text-left p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-md">
                    <img src={product.image} alt="" />
                  </div>
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">{product.price.toLocaleString()}</td>
                <td className="p-4">{product.stock_quantity}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                    {/* <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        product.status === "Edit" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.status}
                    </span> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100">{"<"}</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-black text-white">1</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">2</button>
        <span className="px-2">...</span>
        <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">9</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">10</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100">{">"}</button>
      </div>
    </div>
  )
}



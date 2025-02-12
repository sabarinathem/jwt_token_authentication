import api from "@/api";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SortDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()
  const category_id = useSelector((state)=>{
    return state.category_id
  })
 

  // Sort the product on the basis of price from low to high

  const sortByPriceAscending = async()=>{
      try{
        if(category_id){
          const res = await api.get(`sort_products/?sort_type=asc&sort_by=price&category_id=${category_id}`)
          dispatch({type:'set_products',payload:res.data.sorted_data})
        }
        else{
          const res = await api.get('sort_products/?sort_type=asc&sort_by=price')
          dispatch({type:'set_products',payload:res.data.sorted_data})
        }
        
      }
      catch(error){
        console.log(error.message)
      }
  }

  // Sort the product on the basis of price from high to low

  const sortByPriceDescending = async()=>{
    try{
      if(category_id){
        const res = await api.get(`sort_products/?sort_type=desc&sort_by=price&category_id=${category_id}`)
        dispatch({type:'set_products',payload:res.data.sorted_data})
      }
      else{
        const res = await api.get('sort_products/?sort_type=desc&sort_by=price')
        dispatch({type:'set_products',payload:res.data.sorted_data})
      }
      
    }
    catch(error){
      console.log(error.message)
    }
}
  

  // Sort the product on the basis of product name from A to Z

  const sortByProductNameAtoZ = async()=>{
    try{
      if(category_id){
        const res = await api.get(`sort_products/?sort_type=asc&sort_by=product_name&category_id=${category_id}`)
        dispatch({type:'set_products',payload:res.data.sorted_data})
      }
      else{
        const res = await api.get('sort_products/?sort_type=asc&sort_by=product_name')
        dispatch({type:'set_products',payload:res.data.sorted_data})
      }
    }
    catch(error){
      console.log(error.message)
    }

  }

  // Sort the product on the basis of product name Z to A

  const sortByProductNameZtoA = async()=>{
    try{
      if(category_id){
        const res = await api.get(`sort_products/?sort_type=desc&sort_by=product_name&category_id=${category_id}`)
        dispatch({type:'set_products',payload:res.data.sorted_data})
      }
      else{
        const res = await api.get('sort_products/?sort_type=desc&sort_by=product_name')
        dispatch({type:'set_products',payload:res.data.sorted_data})
      }
    }
    catch(error){
      console.log(error.message)
    }
  }


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-md bg-white"
      >
        Sort by
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white border rounded-md shadow-md">
          <button
            onClick={sortByPriceAscending}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            price : low to high
          </button>
          <button
            onClick={sortByPriceDescending}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            price : high to low
          </button>
          <button
            onClick={sortByProductNameAtoZ}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Product name : A to Z
          </button>
          <button
            onClick={sortByProductNameZtoA}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Product name : Z to A
          </button>
        </div>
      )}
    </div>
  );
};

export default SortDropDown;

import Footer from '@/components/Footer/Footer'
import Header3 from '@/components/Header/Header3'
import ProductsGrid from '@/components/ProductsGrid/ProductsGrid'
import React, { useEffect, useState } from 'react'
import api from '@/api'
const ProductsPage = () => {
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
  return (
    <div>
      <Header3/>
      <ProductsGrid products={products}/>
      <Footer/>
    </div>
  )
}

export default ProductsPage

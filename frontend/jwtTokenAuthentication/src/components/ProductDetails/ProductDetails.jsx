import api from "@/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const {id} = useParams();
  const [productDetails,setProductDetails] = useState({});
  const [productImages,setProductImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);



  // useEffect
  // =========

  useEffect(()=>{

    const getProductDetails = async()=>{
        try{
          const res = await api.get(`product_details/${id}`);
          setProductDetails(res.data);
          setProductImages(res.data.product_images);

        }
        catch(error){
          console.log(error.message)
        }
    }

    getProductDetails()

  },[])

  // const productImages = [
  //   "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-04%20at%204.35.23%E2%80%AFAM-gTEqpLl6rLtXGn9kVm9Ub5XsNhZ5kj.png", // Replace with actual image URLs
  //   "https://v0.dev/placeholder.svg?height=600&width=400",
  //   "https://v0.dev/placeholder.svg?height=600&width=400",
  //   "https://v0.dev/placeholder.svg?height=600&width=400"
  // ];

  const colorOptions = [
    { id: 1, color: "navy", img: "https://v0.dev/placeholder.svg?height=50&width=50&text=Navy" },
    { id: 2, color: "beige", img: "https://v0.dev/placeholder.svg?height=50&width=50&text=Beige" },
    { id: 3, color: "brown", img: "https://v0.dev/placeholder.svg?height=50&width=50&text=Brown" },
    { id: 4, color: "black", img: "https://v0.dev/placeholder.svg?height=50&width=50&text=Black" }
  ];

  const sizeOptions = ["XS", "S", "M", "L", "XL"];

  const stylesWithItems = [
    { id: 1, img: "https://v0.dev/placeholder.svg?height=150&width=150&text=Jacket" },
    { id: 2, img: "https://v0.dev/placeholder.svg?height=150&width=150&text=T-shirt" },
    { id: 3, img: "https://v0.dev/placeholder.svg?height=150&width=150&text=Bag" },
    { id: 4, img: "https://v0.dev/placeholder.svg?height=150&width=150&text=White+Shirt" }
  ];

  const othersAlsoBought = [
    { id: 1, img: "https://v0.dev/placeholder.svg?height=150&width=150&text=White+Tee" },
    { id: 2, img: "https://v0.dev/placeholder.svg?height=150&width=150&text=Navy+Tee" },
    { id: 3, img: "https://v0.dev/placeholder.svg?height=150&width=150&text=Beige+Tee" },
    { id: 4, img: "https://v0.dev/placeholder.svg?height=150&width=150&text=Cap" }
  ];

  const reviews = [
    {
      id: 1,
      author: "Alex Johnson",
      date: "February 15, 2025",
      rating: 5,
      content: "This flannel shirt is exactly what I was looking for. The fit is perfect and the material is high quality. Highly recommend!"
    },
    {
      id: 2,
      author: "Sam Wilson",
      date: "January 28, 2025",
      rating: 4,
      content: "Great shirt, comfortable and stylish. The only reason I'm giving 4 stars instead of 5 is that it runs slightly large."
    },
    {
      id: 3,
      author: "Taylor Kim",
      date: "January 10, 2025",
      rating: 5,
      content: "Perfect for layering in colder weather. The fabric is soft and the pattern goes with everything."
    },
    {
      id: 4,
      author: "Jordan Smith",
      date: "December 5, 2024",
      rating: 3,
      content: "The quality is good but the color is slightly different from what's shown in the pictures."
    }
  ];

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const [expandedSections, setExpandedSections] = useState({
    description: false,
    materials: false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim() !== "") {
      setCouponApplied(true);
      // In a real app, you would validate the coupon code with an API call
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="#" className="hover:text-gray-700">Home</a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <a href="#" className="ml-1 hover:text-gray-700">Men</a>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <a href="#" className="ml-1 hover:text-gray-700">Shirts</a>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-gray-800 font-medium">Loose Fit Flannel Shirt</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Main product images with zoom functionality */}
            {productImages.map((image,index) => (
              <div 
                key={index}
                className="relative overflow-hidden bg-gray-100 aspect-[3/4] cursor-zoom-in"
                onClick={() => handleImageClick(index)}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img 
                  src={image}
                  alt={`Product view ${index + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isZoomed && selectedImage === index ? "scale-150" : ""
                  }`}
                  style={
                    isZoomed && selectedImage === index
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                        }
                      : {}
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-medium">{productDetails.product_name}</h1>
            <p className="text-sm text-gray-500">MRP inclusive of all taxes</p>
            
            {/* Enhanced Rating Display */}
            <div className="flex items-center mt-2">
              {renderStars(4)}
              <span className="text-sm ml-2 text-gray-600">(99 Reviews)</span>
            </div>
            
            <div className="flex items-center mt-3">
              <p className="text-lg font-medium">{productDetails.product_price} Rs</p>
              <p className="ml-3 text-sm line-through text-gray-500">Rs. 1999.00</p>
              <p className="ml-2 text-sm text-green-600">25% off</p>
            </div>
          </div>

          {/* Color Options */}
          <div>
            <p className="text-sm font-medium mb-2">Color</p>
            <div className="flex space-x-2">
              {colorOptions.map((option) => (
                <button 
                  key={option.id} 
                  className="w-12 h-12 border hover:border-black focus:outline-none"
                >
                  <img 
                    src={option.img || "/placeholder.svg"} 
                    alt={option.color} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <p className="text-sm font-medium mb-2">Size</p>
            <div className="grid grid-cols-5 gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  className={`py-2 px-4 border ${
                    selectedSize === size 
                      ? "border-black bg-gray-100" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Coupon Section */}
          <div className="border p-4 rounded-md bg-gray-50">
            <p className="text-sm font-medium mb-2">Apply Discount Coupon</p>
            <div className="flex">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-grow border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button 
                onClick={handleApplyCoupon}
                className="ml-2 bg-gray-800 text-white px-4 py-2 text-sm hover:bg-black transition-colors"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-sm text-green-600 mt-2">Coupon applied successfully!</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors">
            ADD TO CART
          </button>

          {/* Availability Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {productDetails.product_stock_quantity>0?<span className="text-sm">{productDetails.product_stock_quantity} stocks available in stores</span>:
              <span className="text-sm">Not available in stores</span>
              }
              
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Delivery time: 2-7 Days</span>
            </div>
          </div>

          {/* Wishlist Button */}
          <button className="absolute top-4 right-4 md:static md:mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="mt-8 border-t pt-6 space-y-4">
        <div>
          <button 
            className="flex justify-between items-center w-full py-2 text-left font-medium"
            onClick={() => toggleSection('description')}
          >
            <span>Description & fit</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${expandedSections.description ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.description && (
            <div className="py-2 text-sm text-gray-600">
              <p>This loose fit flannel shirt is perfect for casual wear. Made with high-quality materials for comfort and durability.</p>
              <p className="mt-2">The relaxed fit provides a comfortable silhouette that's perfect for layering.</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <button 
            className="flex justify-between items-center w-full py-2 text-left font-medium"
            onClick={() => toggleSection('materials')}
          >
            <span>Materials</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${expandedSections.materials ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.materials && (
            <div className="py-2 text-sm text-gray-600">
              <p>100% Cotton</p>
              <p className="mt-2">Machine washable at 30°C</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-12 border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Customer Reviews</h2>
          <button 
            className="text-sm text-gray-600 hover:text-black"
            onClick={() => setReviewsExpanded(!reviewsExpanded)}
          >
            {reviewsExpanded ? "Show less" : "View all reviews"}
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            {renderStars(4)}
            <span className="ml-2 text-sm">4.0 out of 5</span>
          </div>
          <p className="text-sm text-gray-600">Based on 99 reviews</p>
          
          {/* Rating Breakdown */}
          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="text-sm w-8">{rating} ★</span>
                <div className="w-full max-w-xs bg-gray-200 h-2 mx-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-400 h-full rounded-full" 
                    style={{ 
                      width: `${rating === 5 ? 65 : rating === 4 ? 20 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">
                  {rating === 5 ? 65 : rating === 4 ? 20 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-6">
          {(reviewsExpanded ? reviews : reviews.slice(0, 2)).map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{review.author}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-gray-700 mt-2">{review.content}</p>
            </div>
          ))}
        </div>

        {/* Write a Review Button */}
        <button className="mt-6 border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition-colors">
          Write a Review
        </button>
      </div>

      {/* Styles With Section */}
      <div className="mt-12">
        <h2 className="font-medium mb-4">Styles With</h2>
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stylesWithItems.map((item) => (
              <div key={item.id} className="border p-2">
                <img src={item.img || "/placeholder.svg"} alt={`Style item ${item.id}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Others Also Bought Section */}
      <div className="mt-12">
        <h2 className="font-medium mb-4">Others also bought</h2>
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {othersAlsoBought.map((item) => (
              <div key={item.id} className="border p-2">
                <img src={item.img || "/placeholder.svg"} alt={`Related item ${item.id}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          </div>
        </div>
      </div>
  );
};

export default ProductPage;


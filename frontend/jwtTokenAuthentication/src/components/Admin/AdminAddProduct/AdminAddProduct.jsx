"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Cropper from "react-easy-crop"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDispatch, useSelector } from "react-redux"
import api from "@/api"

const MAX_IMAGES = 6
const MIN_IMAGES = 1

// Variant Component
function Variant({
  variant,
  index,
  onVariantChange,
  onRemoveImage,
  onRemoveVariant,
  setCurrentImage,
  setCurrentVariantIndex,
  setError,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (variant.images.length + acceptedFiles.length > MAX_IMAGES) {
        setError(`You can only upload up to ${MAX_IMAGES} images per variant`)
        return
      }

      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          setCurrentImage(reader.result)
          setCurrentVariantIndex(index)
        }
        reader.readAsDataURL(file)
      })
    },
    [variant.images, index, setCurrentImage, setCurrentVariantIndex, setError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    multiple: true,
    maxSize: 5242880, // 5MB
  })

  return (
    <div className="border p-4 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        <div>
          <Label>Size</Label>
          <Select
            value={variant.size}
            onValueChange={(value) => onVariantChange(index, "size", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">XS</SelectItem>
              <SelectItem value="s">S</SelectItem>
              <SelectItem value="m">M</SelectItem>
              <SelectItem value="l">L</SelectItem>
              <SelectItem value="xl">XL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Color</Label>
          <Input
            type="color"
            value={variant.color}
            onChange={(e) => onVariantChange(index, "color", e.target.value)}
          />
        </div>
        <div>
          <Label>Color Name</Label>
          <Input
            value={variant.colorName}
            onChange={(e) => onVariantChange(index, "colorName", e.target.value)}
            placeholder="e.g., Navy Blue"
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            type="number"
            value={variant.price}
            onChange={(e) => onVariantChange(index, "price", e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            value={variant.stock}
            onChange={(e) => onVariantChange(index, "stock", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* Images for this variant */}
      <div>
        <Label>Variant Images</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {variant.images.map((image, imgIndex) => (
            <Card key={imgIndex} className="relative">
              <CardContent className="p-2">
                <img
                  src={image}
                  alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => onRemoveImage(index, imgIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {variant.images.length < MAX_IMAGES && (
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-4 hover:border-primary cursor-pointer flex items-center justify-center min-h-[200px]"
            >
              <input {...getInputProps()} />
              <div className="text-center space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? "Drop the files here"
                    : `Drag & drop images here or click to select (${variant.images.length}/${MAX_IMAGES})`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {index > 0 && (
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onRemoveVariant(index)}
          className="mt-4"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Main ProductForm Component
export default function AdminAddProduct() {
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [variants, setVariants] = useState([
    {
      size: "",
      color: "#000000",
      colorName: "",
      price: "",
      stock: "",
      images: [],
    },
  ])
  const [currentImage, setCurrentImage] = useState(null)
  const [currentVariantIndex, setCurrentVariantIndex] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [cropAspectRatio, setCropAspectRatio] = useState(1)
  const [error, setError] = useState("")

  const categories = useSelector((state) => state.categories)
  const [selectCategory,setSelectCategory] = useState(categories[0]?.id ?? 0)
  const dispatch = useDispatch()

  useEffect(() => {
    const getCategoryData = async () => {
      try {
        const res = await api.get('/get-categories/')
        dispatch({ type: 'set_categories', payload: res.data })
        setSelectCategory(res.data[0].id)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    getCategoryData()
  }, [dispatch])

  const handlePublish = async () => {
    console.log(categories)
    const hasInvalidVariants = variants.some((variant) => variant.images.length < MIN_IMAGES)
    if (hasInvalidVariants) {
      setError(`Each variant needs at least ${MIN_IMAGES} image`)
      return
    }
  
    const productData = {
      productName,
      description,
      variants,
      categories: selectCategory ?? 1, // Adjust based on your Redux state; assuming first category ID
    }

    console.log(`Product data\n${productData}`)
  
    try {
      const response = await api.post('/add-product/', productData, {
        headers: {
          'Content-Type': 'application/json',
          // Add authentication token if required, e.g., 'Authorization': `Bearer ${token}`
        },
      })
      console.log('Product added successfully:', response.data)
      setError("") // Clear error on success
      // Optionally reset form or redirect
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message)
      setError(error.response?.data?.error || "Failed to add product")
    }
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = async (imageSrc, pixelCrop) => {
    const image = new Image()
    image.src = imageSrc

    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        )
        resolve(canvas.toDataURL('image/jpeg'))
      }
    })
  }

  const saveCroppedImage = useCallback(async () => {
    try {
      if (currentImage && croppedAreaPixels && currentVariantIndex !== null) {
        const croppedImage = await createCroppedImage(currentImage, croppedAreaPixels)
        const newVariants = [...variants]
        newVariants[currentVariantIndex].images = [...newVariants[currentVariantIndex].images, croppedImage]
        setVariants(newVariants)
        setCurrentImage(null)
        setCurrentVariantIndex(null)
        setError("")
      }
    } catch (e) {
      setError("Error saving cropped image")
    }
  }, [currentImage, croppedAreaPixels, currentVariantIndex, variants])

  const removeImage = (variantIndex, imageIndex) => {
    const newVariants = [...variants]
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imageIndex)
    setVariants(newVariants)
    if (newVariants[variantIndex].images.length < MIN_IMAGES) {
      setError(`Each variant needs at least ${MIN_IMAGES} image`)
    } else {
      setError("")
    }
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: "",
        color: "#000000",
        colorName: "",
        price: "",
        stock: "",
        images: [],
      },
    ])
  }

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)
  }

  // const handlePublish = () => {
  //   const hasInvalidVariants = variants.some((variant) => variant.images.length < MIN_IMAGES)
  //   if (hasInvalidVariants) {
  //     setError(`Each variant needs at least ${MIN_IMAGES} image`)
  //     return
  //   }

  //   console.log({
  //     productName,
  //     description,
  //     variants,
  //     categories,
  //   })
  // }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Type here"
          />
        </div>

        <div>
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type here"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label>Product Variants</Label>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-6 mt-2">
            {variants.map((variant, index) => (
              <Variant
                key={index}
                variant={variant}
                index={index}
                onVariantChange={handleVariantChange}
                onRemoveImage={removeImage}
                onRemoveVariant={removeVariant}
                setCurrentImage={setCurrentImage}
                setCurrentVariantIndex={setCurrentVariantIndex}
                setError={setError}
              />
            ))}
          </div>
          <Button variant="outline" onClick={addVariant} className="mt-4">
            Add Variant
          </Button>
        </div>

        {currentImage && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="fixed inset-x-4 top-[50%] translate-y-[-50%] max-h-[90vh] bg-background rounded-lg shadow-lg p-6">
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Button
                    variant={cropAspectRatio === 1 ? "default" : "outline"}
                    onClick={() => setCropAspectRatio(1)}
                  >
                    1:1
                  </Button>
                  <Button
                    variant={cropAspectRatio === 4 / 3 ? "default" : "outline"}
                    onClick={() => setCropAspectRatio(4 / 3)}
                  >
                    4:3
                  </Button>
                  <Button
                    variant={cropAspectRatio === 16 / 9 ? "default" : "outline"}
                    onClick={() => setCropAspectRatio(16 / 9)}
                  >
                    16:9
                  </Button>
                </div>
                <div className="relative h-[400px]">
                  <Cropper
                    image={currentImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={cropAspectRatio}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label>Zoom</Label>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentImage(null)
                      setCurrentVariantIndex(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveCroppedImage}>Save Cropped Image</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={selectCategory} onValueChange={setSelectCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((obj) => (
                <SelectItem key={obj.id} value={obj.id}>
                  {obj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full md:w-auto" onClick={handlePublish}>
          Publish
        </Button>
      </div>
    </div>
  )
}


// drag and drop working
// ====================

// "use client"

// import { useState, useCallback, useEffect } from "react"
// import { useDropzone } from "react-dropzone"
// import Cropper from "react-easy-crop"
// import { X, Upload } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useDispatch, useSelector } from "react-redux"
// import api from "@/api"

// const MAX_IMAGES = 6
// const MIN_IMAGES = 1

// export default function ProductForm() {
//   const [productName, setProductName] = useState("")
//   const [description, setDescription] = useState("")
//   const [variants, setVariants] = useState([
//     {
//       size: "",
//       color: "#000000",
//       colorName: "",
//       price: "",
//       stock: "",
//       images: [],
//     },
//   ])
//   const [currentImage, setCurrentImage] = useState(null)
//   const [currentVariantIndex, setCurrentVariantIndex] = useState(null)
//   const [crop, setCrop] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
//   const [cropAspectRatio, setCropAspectRatio] = useState(1)
//   const [error, setError] = useState("")

//   const categories = useSelector((state) => state.categories)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     const getCategoryData = async () => {
//       try {
//         const res = await api.get('/get-categories/')
//         dispatch({ type: 'set_categories', payload: res.data })
//       } catch (error) {
//         console.error("Failed to fetch categories:", error)
//       }
//     }
//     getCategoryData()
//   }, [dispatch])

//   // Single useDropzone instance with variant-specific handling
//   const onDrop = useCallback(
//     (acceptedFiles, variantIndex) => {
//       const currentImages = variants[variantIndex].images
//       if (currentImages.length + acceptedFiles.length > MAX_IMAGES) {
//         setError(`You can only upload up to ${MAX_IMAGES} images per variant`)
//         return
//       }

//       acceptedFiles.forEach((file) => {
//         const reader = new FileReader()
//         reader.onload = () => {
//           setCurrentImage(reader.result)
//           setCurrentVariantIndex(variantIndex)
//         }
//         reader.readAsDataURL(file)
//       })
//     },
//     [variants]
//   )

//   // Generate dropzone props for a specific variant
//   const getDropzonePropsForVariant = (variantIndex) => {
//     return useDropzone({
//       onDrop: (acceptedFiles) => onDrop(acceptedFiles, variantIndex),
//       accept: { "image/*": [".jpeg", ".jpg", ".png"] },
//       multiple: true,
//       maxSize: 5242880, // 5MB
//     })
//   }

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels)
//   }, [])

//   const createCroppedImage = async (imageSrc, pixelCrop) => {
//     const image = new Image()
//     image.src = imageSrc

//     return new Promise((resolve) => {
//       image.onload = () => {
//         const canvas = document.createElement('canvas')
//         const ctx = canvas.getContext('2d')
//         canvas.width = pixelCrop.width
//         canvas.height = pixelCrop.height
//         ctx.drawImage(
//           image,
//           pixelCrop.x,
//           pixelCrop.y,
//           pixelCrop.width,
//           pixelCrop.height,
//           0,
//           0,
//           pixelCrop.width,
//           pixelCrop.height
//         )
//         resolve(canvas.toDataURL('image/jpeg'))
//       }
//     })
//   }

//   const saveCroppedImage = useCallback(async () => {
//     try {
//       if (currentImage && croppedAreaPixels && currentVariantIndex !== null) {
//         const croppedImage = await createCroppedImage(currentImage, croppedAreaPixels)
//         const newVariants = [...variants]
//         newVariants[currentVariantIndex].images = [...newVariants[currentVariantIndex].images, croppedImage]
//         setVariants(newVariants)
//         setCurrentImage(null)
//         setCurrentVariantIndex(null)
//         setError("")
//       }
//     } catch (e) {
//       setError("Error saving cropped image")
//     }
//   }, [currentImage, croppedAreaPixels, currentVariantIndex, variants])

//   const removeImage = (variantIndex, imageIndex) => {
//     const newVariants = [...variants]
//     newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imageIndex)
//     setVariants(newVariants)
//     if (newVariants[variantIndex].images.length < MIN_IMAGES) {
//       setError(`Each variant needs at least ${MIN_IMAGES} image`)
//     } else {
//       setError("")
//     }
//   }

//   const addVariant = () => {
//     setVariants([
//       ...variants,
//       {
//         size: "",
//         color: "#000000",
//         colorName: "",
//         price: "",
//         stock: "",
//         images: [],
//       },
//     ])
//   }

//   const removeVariant = (index) => {
//     setVariants(variants.filter((_, i) => i !== index))
//   }

//   const handleVariantChange = (index, field, value) => {
//     const newVariants = [...variants]
//     newVariants[index][field] = value
//     setVariants(newVariants)
//   }

//   const handlePublish = () => {
//     const hasInvalidVariants = variants.some(variant => variant.images.length < MIN_IMAGES)
//     if (hasInvalidVariants) {
//       setError(`Each variant needs at least ${MIN_IMAGES} image`)
//       return
//     }

//     console.log({
//       productName,
//       description,
//       variants,
//       categories,
//     })
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-8">
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="productName">Product Name</Label>
//           <Input
//             id="productName"
//             value={productName}
//             onChange={(e) => setProductName(e.target.value)}
//             placeholder="Type here"
//           />
//         </div>

//         <div>
//           <Label htmlFor="description">Full Description</Label>
//           <Textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Type here"
//             className="min-h-[100px]"
//           />
//         </div>

//         <div>
//           <Label>Product Variants</Label>
//           <div className="space-y-6 mt-2">
//             {variants.map((variant, index) => {
//               const { getRootProps, getInputProps, isDragActive } = getDropzonePropsForVariant(index)
//               return (
//                 <div key={index} className="border p-4 rounded-lg space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
//                     <div>
//                       <Label>Size</Label>
//                       <Select
//                         value={variant.size}
//                         onValueChange={(value) => handleVariantChange(index, "size", value)}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Size" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="xs">XS</SelectItem>
//                           <SelectItem value="s">S</SelectItem>
//                           <SelectItem value="m">M</SelectItem>
//                           <SelectItem value="l">L</SelectItem>
//                           <SelectItem value="xl">XL</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <Label>Color</Label>
//                       <Input
//                         type="color"
//                         value={variant.color}
//                         onChange={(e) => handleVariantChange(index, "color", e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <Label>Color Name</Label>
//                       <Input
//                         value={variant.colorName}
//                         onChange={(e) => handleVariantChange(index, "colorName", e.target.value)}
//                         placeholder="e.g., Navy Blue"
//                       />
//                     </div>
//                     <div>
//                       <Label>Price</Label>
//                       <Input
//                         type="number"
//                         value={variant.price}
//                         onChange={(e) => handleVariantChange(index, "price", e.target.value)}
//                         placeholder="0.00"
//                       />
//                     </div>
//                     <div>
//                       <Label>Stock</Label>
//                       <Input
//                         type="number"
//                         value={variant.stock}
//                         onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
//                         placeholder="0"
//                       />
//                     </div>
//                   </div>

//                   {/* Images for this variant */}
//                   <div>
//                     <Label>Variant Images</Label>
//                     {error && (
//                       <Alert variant="destructive" className="mb-4">
//                         <AlertDescription>{error}</AlertDescription>
//                       </Alert>
//                     )}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
//                       {variant.images.map((image, imgIndex) => (
//                         <Card key={imgIndex} className="relative">
//                           <CardContent className="p-2">
//                             <img
//                               src={image}
//                               alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
//                               className="w-full h-48 object-cover rounded-lg"
//                             />
//                             <Button
//                               variant="destructive"
//                               size="icon"
//                               className="absolute top-4 right-4"
//                               onClick={() => removeImage(index, imgIndex)}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </CardContent>
//                         </Card>
//                       ))}
//                       {variant.images.length < MAX_IMAGES && (
//                         <div
//                           {...getRootProps()}
//                           className="border-2 border-dashed rounded-lg p-4 hover:border-primary cursor-pointer flex items-center justify-center min-h-[200px]"
//                         >
//                           <input {...getInputProps()} />
//                           <div className="text-center space-y-2">
//                             <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
//                             <p className="text-sm text-muted-foreground">
//                               {isDragActive
//                                 ? "Drop the files here"
//                                 : `Drag & drop images here or click to select (${variant.images.length}/${MAX_IMAGES})`}
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {variants.length > 1 && (
//                     <Button
//                       variant="destructive"
//                       size="icon"
//                       onClick={() => removeVariant(index)}
//                       className="mt-4"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//               )
//             })}
//           </div>
//           <Button variant="outline" onClick={addVariant} className="mt-4">
//             Add Variant
//           </Button>
//         </div>

//         {currentImage && (
//           <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
//             <div className="fixed inset-x-4 top-[50%] translate-y-[-50%] max-h-[90vh] bg-background rounded-lg shadow-lg p-6">
//               <div className="space-y-4">
//                 <div className="flex gap-4 mb-4">
//                   <Button
//                     variant={cropAspectRatio === 1 ? "default" : "outline"}
//                     onClick={() => setCropAspectRatio(1)}
//                   >
//                     1:1
//                   </Button>
//                   <Button
//                     variant={cropAspectRatio === 4 / 3 ? "default" : "outline"}
//                     onClick={() => setCropAspectRatio(4 / 3)}
//                   >
//                     4:3
//                   </Button>
//                   <Button
//                     variant={cropAspectRatio === 16 / 9 ? "default" : "outline"}
//                     onClick={() => setCropAspectRatio(16 / 9)}
//                   >
//                     16:9
//                   </Button>
//                 </div>
//                 <div className="relative h-[400px]">
//                   <Cropper
//                     image={currentImage}
//                     crop={crop}
//                     zoom={zoom}
//                     aspect={cropAspectRatio}
//                     onCropChange={setCrop}
//                     onZoomChange={setZoom}
//                     onCropComplete={onCropComplete}
//                   />
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <Label>Zoom</Label>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={1}
//                     max={3}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setCurrentImage(null)
//                       setCurrentVariantIndex(null)
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={saveCroppedImage}>Save Cropped Image</Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div>
//           <Label htmlFor="category">Category</Label>
//           <Select>
//             <SelectTrigger>
//               <SelectValue placeholder="Choose a category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="clothing">Clothing</SelectItem>
//               <SelectItem value="accessories">Accessories</SelectItem>
//               <SelectItem value="footwear">Footwear</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Button className="w-full md:w-auto" onClick={handlePublish}>Publish</Button>
//       </div>
//     </div>
//   )
// }




// "use client"

// import { useState, useCallback, useEffect } from "react"
// import { useDropzone } from "react-dropzone"
// import Cropper from "react-easy-crop"
// import { X, Upload } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useDispatch, useSelector } from "react-redux"
// import api from "@/api"

// const MAX_IMAGES = 6
// const MIN_IMAGES = 1

// export default function ProductForm() {
//   const [productName, setProductName] = useState("")
//   const [description, setDescription] = useState("")
//   const [variants, setVariants] = useState([
//     {
//       size: "",
//       color: "#000000", // Default valid color value
//       colorName: "",
//       price: "",
//       stock: "",
//       images: [],
//     },
//   ])
//   const [currentImage, setCurrentImage] = useState(null)
//   const [currentVariantIndex, setCurrentVariantIndex] = useState(null)
//   const [crop, setCrop] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
//   const [cropAspectRatio, setCropAspectRatio] = useState(1)
//   const [error, setError] = useState("")

//   const categories = useSelector((state) => state.categories)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     const getCategoryData = async () => {
//       try {
//         const res = await api.get('/get-categories/')
//         dispatch({ type: 'set_categories', payload: res.data })
//       } catch (error) {
//         console.error("Failed to fetch categories:", error)
//       }
//     }
//     getCategoryData()
//   }, [dispatch])

//   // Single useDropzone instance
//   const onDrop = useCallback((acceptedFiles) => {
//     if (currentVariantIndex === null) return; // Ensure we know which variant to apply to

//     const currentImages = variants[currentVariantIndex].images
//     if (currentImages.length + acceptedFiles.length > MAX_IMAGES) {
//       setError(`You can only upload up to ${MAX_IMAGES} images per variant`)
//       return
//     }

//     acceptedFiles.forEach((file) => {
//       const reader = new FileReader()
//       reader.onload = () => {
//         setCurrentImage(reader.result)
//       }
//       reader.readAsDataURL(file)
//     })
//   }, [variants, currentVariantIndex])

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "image/*": [".jpeg", ".jpg", ".png"] },
//     multiple: true,
//     maxSize: 5242880, // 5MB
//   })

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels)
//   }, [])

//   const createCroppedImage = async (imageSrc, pixelCrop) => {
//     const image = new Image()
//     image.src = imageSrc

//     return new Promise((resolve) => {
//       image.onload = () => {
//         const canvas = document.createElement('canvas')
//         const ctx = canvas.getContext('2d')
//         canvas.width = pixelCrop.width
//         canvas.height = pixelCrop.height
//         ctx.drawImage(
//           image,
//           pixelCrop.x,
//           pixelCrop.y,
//           pixelCrop.width,
//           pixelCrop.height,
//           0,
//           0,
//           pixelCrop.width,
//           pixelCrop.height
//         )
//         resolve(canvas.toDataURL('image/jpeg'))
//       }
//     })
//   }

//   const saveCroppedImage = useCallback(async () => {
//     try {
//       if (currentImage && croppedAreaPixels && currentVariantIndex !== null) {
//         const croppedImage = await createCroppedImage(currentImage, croppedAreaPixels)
//         const newVariants = [...variants]
//         newVariants[currentVariantIndex].images = [...newVariants[currentVariantIndex].images, croppedImage]
//         setVariants(newVariants)
//         setCurrentImage(null)
//         setCurrentVariantIndex(null)
//         setError("")
//       }
//     } catch (e) {
//       setError("Error saving cropped image")
//     }
//   }, [currentImage, croppedAreaPixels, currentVariantIndex, variants])

//   const removeImage = (variantIndex, imageIndex) => {
//     const newVariants = [...variants]
//     newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imageIndex)
//     setVariants(newVariants)
//     if (newVariants[variantIndex].images.length < MIN_IMAGES) {
//       setError(`Each variant needs at least ${MIN_IMAGES} image`)
//     } else {
//       setError("")
//     }
//   }

//   const addVariant = () => {
//     setVariants([
//       ...variants,
//       {
//         size: "",
//         color: "#000000", // Default valid color value
//         colorName: "",
//         price: "",
//         stock: "",
//         images: [],
//       },
//     ])
//   }

//   const removeVariant = (index) => {
//     setVariants(variants.filter((_, i) => i !== index))
//   }

//   const handleVariantChange = (index, field, value) => {
//     const newVariants = [...variants]
//     newVariants[index][field] = value
//     setVariants(newVariants)
//   }

//   const handlePublish = () => {
//     const hasInvalidVariants = variants.some(variant => variant.images.length < MIN_IMAGES)
//     if (hasInvalidVariants) {
//       setError(`Each variant needs at least ${MIN_IMAGES} image`)
//       return
//     }

//     console.log({
//       productName,
//       description,
//       variants,
//       categories,
//     })
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-8">
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="productName">Product Name</Label>
//           <Input
//             id="productName"
//             value={productName}
//             onChange={(e) => setProductName(e.target.value)}
//             placeholder="Type here"
//           />
//         </div>

//         <div>
//           <Label htmlFor="description">Full Description</Label>
//           <Textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Type here"
//             className="min-h-[100px]"
//           />
//         </div>

//         <div>
//           <Label>Product Variants</Label>
//           <div className="space-y-6 mt-2">
//             {variants.map((variant, index) => (
//               <div key={index} className="border p-4 rounded-lg space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
//                   <div>
//                     <Label>Size</Label>
//                     <Select
//                       value={variant.size}
//                       onValueChange={(value) => handleVariantChange(index, "size", value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Size" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="xs">XS</SelectItem>
//                         <SelectItem value="s">S</SelectItem>
//                         <SelectItem value="m">M</SelectItem>
//                         <SelectItem value="l">L</SelectItem>
//                         <SelectItem value="xl">XL</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label>Color</Label>
//                     <Input
//                       type="color"
//                       value={variant.color}
//                       onChange={(e) => handleVariantChange(index, "color", e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label>Color Name</Label>
//                     <Input
//                       value={variant.colorName}
//                       onChange={(e) => handleVariantChange(index, "colorName", e.target.value)}
//                       placeholder="e.g., Navy Blue"
//                     />
//                   </div>
//                   <div>
//                     <Label>Price</Label>
//                     <Input
//                       type="number"
//                       value={variant.price}
//                       onChange={(e) => handleVariantChange(index, "price", e.target.value)}
//                       placeholder="0.00"
//                     />
//                   </div>
//                   <div>
//                     <Label>Stock</Label>
//                     <Input
//                       type="number"
//                       value={variant.stock}
//                       onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
//                       placeholder="0"
//                     />
//                   </div>
//                 </div>

//                 {/* Images for this variant */}
//                 <div>
//                   <Label>Variant Images</Label>
//                   {error && (
//                     <Alert variant="destructive" className="mb-4">
//                       <AlertDescription>{error}</AlertDescription>
//                     </Alert>
//                   )}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
//                     {variant.images.map((image, imgIndex) => (
//                       <Card key={imgIndex} className="relative">
//                         <CardContent className="p-2">
//                           <img
//                             src={image}
//                             alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
//                             className="w-full h-48 object-cover rounded-lg"
//                           />
//                           <Button
//                             variant="destructive"
//                             size="icon"
//                             className="absolute top-4 right-4"
//                             onClick={() => removeImage(index, imgIndex)}
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </CardContent>
//                       </Card>
//                     ))}
//                     {variant.images.length < MAX_IMAGES && (
//                       <div
//                         {...getRootProps()}
//                         className="border-2 border-dashed rounded-lg p-4 hover:border-primary cursor-pointer flex items-center justify-center min-h-[200px]"
//                         onClick={() => setCurrentVariantIndex(index)} // Set the variant index on click
//                       >
//                         <input {...getInputProps()} />
//                         <div className="text-center space-y-2">
//                           <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
//                           <p className="text-sm text-muted-foreground">
//                             {isDragActive
//                               ? "Drop the files here"
//                               : `Drag & drop images here or click to select (${variant.images.length}/${MAX_IMAGES})`}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {variants.length > 1 && (
//                   <Button
//                     variant="destructive"
//                     size="icon"
//                     onClick={() => removeVariant(index)}
//                     className="mt-4"
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </div>
//           <Button variant="outline" onClick={addVariant} className="mt-4">
//             Add Variant
//           </Button>
//         </div>

//         {currentImage && (
//           <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
//             <div className="fixed inset-x-4 top-[50%] translate-y-[-50%] max-h-[90vh] bg-background rounded-lg shadow-lg p-6">
//               <div className="space-y-4">
//                 <div className="flex gap-4 mb-4">
//                   <Button
//                     variant={cropAspectRatio === 1 ? "default" : "outline"}
//                     onClick={() => setCropAspectRatio(1)}
//                   >
//                     1:1
//                   </Button>
//                   <Button
//                     variant={cropAspectRatio === 4 / 3 ? "default" : "outline"}
//                     onClick={() => setCropAspectRatio(4 / 3)}
//                   >
//                     4:3
//                   </Button>
//                   <Button
//                     variant={cropAspectRatio === 16 / 9 ? "default" : "outline"}
//                     onClick={() => setCropAspectRatio(16 / 9)}
//                   >
//                     16:9
//                   </Button>
//                 </div>
//                 <div className="relative h-[400px]">
//                   <Cropper
//                     image={currentImage}
//                     crop={crop}
//                     zoom={zoom}
//                     aspect={cropAspectRatio}
//                     onCropChange={setCrop}
//                     onZoomChange={setZoom}
//                     onCropComplete={onCropComplete}
//                   />
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <Label>Zoom</Label>
//                   <input
//                     type="range"
//                     value={zoom}
//                     min={1}
//                     max={3}
//                     step={0.1}
//                     onChange={(e) => setZoom(Number(e.target.value))}
//                     className="w-full"
//                   />
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setCurrentImage(null)
//                       setCurrentVariantIndex(null)
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={saveCroppedImage}>Save Cropped Image</Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div>
//           <Label htmlFor="category">Category</Label>
//           <Select>
//             <SelectTrigger>
//               <SelectValue placeholder="Choose a category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="clothing">Clothing</SelectItem>
//               <SelectItem value="accessories">Accessories</SelectItem>
//               <SelectItem value="footwear">Footwear</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Button className="w-full md:w-auto" onClick={handlePublish}>Publish</Button>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useCallback, useEffect } from "react"
// import { useDropzone } from "react-dropzone"
// import Cropper from "react-easy-crop"
// import { X, Upload } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useDispatch, useSelector} from "react-redux"
// import api from "@/api"

// const MAX_IMAGES = 6
// const MIN_IMAGES = 1


// export default function ProductForm() {
//   const [productName, setProductName] = useState(""); //for get product name
//   const [description, setDescription] = useState(""); //for get product description
//   const [variants, setVariants] = useState([
//     {
//       size: "",
//       color: "",
//       colorName: "",
//       price: "",
//       stock: "",
//     },
//   ]); // for get variants data

//   const [images, setImages] = useState([])
//   const [currentImage, setCurrentImage] = useState(null)
//   const [crop, setCrop] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
//   const [cropAspectRatio, setCropAspectRatio] = useState(1)
//   const [error, setError] = useState("")

//   // get category data from redux

//   const categories = useSelector((state)=>{
//     return state.categories
//   })

//   const dispatch = useDispatch()


//   useEffect(()=>{
//     const getCategoryData = async()=>{
//       try{
//         const res = await api.get('/get-categories/')
//         dispatch({type:'set_categories',payload:res.data})
        
//       }
//       catch(error){
  
//       }
//     }

//     getCategoryData()
//   },[])
  
//   const onDrop = useCallback((acceptedFiles) => {
//     if (images.length + acceptedFiles.length > MAX_IMAGES) {
//       setError(`You can only upload up to ${MAX_IMAGES} images`)
//       return
//     }

//     acceptedFiles.forEach((file) => {
//       const reader = new FileReader()
//       reader.onload = () => {
//         setCurrentImage(reader.result)
//       }
//       reader.readAsDataURL(file)
//     })
//   }, [images.length])

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "image/*": [".jpeg", ".jpg", ".png"],
//     },
//     multiple: true,
//     maxSize: 5242880, // 5MB
//   })

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels)
//   }, [])

//   // Function to create a cropped image
//   const createCroppedImage = async (imageSrc, pixelCrop) => {
//     const image = new Image()
//     image.src = imageSrc

//     return new Promise((resolve) => {
//       image.onload = () => {
//         const canvas = document.createElement('canvas')
//         const ctx = canvas.getContext('2d')

//         canvas.width = pixelCrop.width
//         canvas.height = pixelCrop.height

//         ctx.drawImage(
//           image,
//           pixelCrop.x,
//           pixelCrop.y,
//           pixelCrop.width,
//           pixelCrop.height,
//           0,
//           0,
//           pixelCrop.width,
//           pixelCrop.height
//         )

//         resolve(canvas.toDataURL('image/jpeg'))
//       }
//     })
//   }

//   const saveCroppedImage = useCallback(async () => {
//     try {
//       if (currentImage && croppedAreaPixels) {
//         const croppedImage = await createCroppedImage(currentImage, croppedAreaPixels)
//         setImages([...images, croppedImage])
//         setCurrentImage(null)
//         setError("")
//       }
//     } catch (e) {
//       setError("Error saving cropped image")
//     }
//   }, [currentImage, croppedAreaPixels, images])

//   const removeImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index)
//     setImages(newImages)
//     if (newImages.length < MIN_IMAGES) {
//       setError(`You need at least ${MIN_IMAGES} image`)
//     } else {
//       setError("")
//     }
//   }

//   const handlePublish = () => {
//     if (images.length < MIN_IMAGES) {
//       setError(`You need at least ${MIN_IMAGES} image`)
//       return
//     }

//     console.log(`Product name = ${productName}
// Product Description = ${description}
// Product Variants = ${variants}`)
// console.log(variants)
// console.log(categories)

    
//   }







//   const addVariant = () => {
//     setVariants([
//       ...variants,
//       {
//         size: "",
//         color: "",
//         colorName: "",
//         price: "",
//         stock: "",
//       },
//     ]);
//   };

//   const removeVariant = (index) => {
//     setVariants(variants.filter((_, i) => i !== index));
//   };

//   const handleVariantChange = (index, field, value) => {
//     const newVariants = [...variants];
//     newVariants[index][field] = value;
//     setVariants(newVariants);
//   };


//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-8">
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="productName">Product Name</Label>
//           <Input
//             id="productName"
//             value={productName}
//             onChange={(e) => setProductName(e.target.value)}
//             placeholder="Type here"
//           />
//         </div>

//         <div>
//           <Label htmlFor="description">Full Description</Label>
//           <Textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Type here"
//             className="min-h-[100px]"
//           />
//         </div>
//         <div className="max-w-4xl mx-auto p-4 space-y-8">
//           {/* Previous form fields remain the same */}

//           <div>
//             <Label>Product Images</Label>
//             {error && (
//               <Alert variant="destructive" className="mb-4">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
//               {images.map((image, index) => (
//                 <Card key={index} className="relative">
//                   <CardContent className="p-2">
//                     <img
//                       src={image}
//                       alt={`Product ${index + 1}`}
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                     <Button
//                       variant="destructive"
//                       size="icon"
//                       className="absolute top-4 right-4"
//                       onClick={() => removeImage(index)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//               {images.length < MAX_IMAGES && (
//                 <div
//                   {...getRootProps()}
//                   className="border-2 border-dashed rounded-lg p-4 hover:border-primary cursor-pointer flex items-center justify-center min-h-[200px]"
//                 >
//                   <input {...getInputProps()} />
//                   <div className="text-center space-y-2">
//                     <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
//                     <p className="text-sm text-muted-foreground">
//                       {isDragActive
//                         ? "Drop the files here"
//                         : `Drag & drop images here or click to select (${images.length}/${MAX_IMAGES})`}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {currentImage && (
//             <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
//               <div className="fixed inset-x-4 top-[50%] translate-y-[-50%] max-h-[90vh] bg-background rounded-lg shadow-lg p-6">
//                 <div className="space-y-4">
//                   <div className="flex gap-4 mb-4">
//                     <Button
//                       variant={cropAspectRatio === 1 ? "default" : "outline"}
//                       onClick={() => setCropAspectRatio(1)}
//                     >
//                       1:1
//                     </Button>
//                     <Button
//                       variant={
//                         cropAspectRatio === 4 / 3 ? "default" : "outline"
//                       }
//                       onClick={() => setCropAspectRatio(4 / 3)}
//                     >
//                       4:3
//                     </Button>
//                     <Button
//                       variant={
//                         cropAspectRatio === 16 / 9 ? "default" : "outline"
//                       }
//                       onClick={() => setCropAspectRatio(16 / 9)}
//                     >
//                       16:9
//                     </Button>
//                   </div>
//                   <div className="relative h-[400px]">
//                     <Cropper
//                       image={currentImage}
//                       crop={crop}
//                       zoom={zoom}
//                       aspect={cropAspectRatio}
//                       onCropChange={setCrop}
//                       onZoomChange={setZoom}
//                       onCropComplete={onCropComplete}
//                     />
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <Label>Zoom</Label>
//                     <input
//                       type="range"
//                       value={zoom}
//                       min={1}
//                       max={3}
//                       step={0.1}
//                       onChange={(e) => setZoom(Number(e.target.value))}
//                       className="w-full"
//                     />
//                   </div>
//                   <div className="flex justify-end gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => setCurrentImage(null)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button onClick={saveCroppedImage}>
//                       Save Cropped Image
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Rest of the form remains the same */}

//           {/* <Button className="w-full md:w-auto" onClick={handlePublish}>
//             Publish
//           </Button> */}
//         </div>


//         <div>
//           <Label>Product Variants</Label>
//           <div className="space-y-4 mt-2">
//             {variants.map((variant, index) => (
//               <div
//                 key={index}
//                 className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start"
//               >
//                 <div>
//                   <Label>Size</Label>
//                   <Select
//                     value={variant.size}
//                     onValueChange={(value) =>
//                       handleVariantChange(index, "size", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Size" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="xs">XS</SelectItem>
//                       <SelectItem value="s">S</SelectItem>
//                       <SelectItem value="m">M</SelectItem>
//                       <SelectItem value="l">L</SelectItem>
//                       <SelectItem value="xl">XL</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Color</Label>
//                   <Input
//                     type="color"
//                     value={variant.color}
//                     onChange={(e) =>
//                       handleVariantChange(index, "color", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div>
//                   <Label>Color Name</Label>
//                   <Input
//                     value={variant.colorName}
//                     onChange={(e) =>
//                       handleVariantChange(index, "colorName", e.target.value)
//                     }
//                     placeholder="e.g., Navy Blue"
//                   />
//                 </div>
//                 <div>
//                   <Label>Price</Label>
//                   <Input
//                     type="number"
//                     value={variant.price}
//                     onChange={(e) =>
//                       handleVariantChange(index, "price", e.target.value)
//                     }
//                     placeholder="0.00"
//                   />
//                 </div>
//                 <div>
//                   <Label>Stock</Label>
//                   <Input
//                     type="number"
//                     value={variant.stock}
//                     onChange={(e) =>
//                       handleVariantChange(index, "stock", e.target.value)
//                     }
//                     placeholder="0"
//                   />
//                 </div>
//                 {variants.length > 1 && (
//                   <Button
//                     variant="destructive"
//                     size="icon"
//                     onClick={() => removeVariant(index)}
//                     className="mt-8"
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//             ))}
//           </div>
//           <Button variant="outline" onClick={addVariant} className="mt-4">
//             Add Variant
//           </Button>
//         </div>

//         <div>
//           <Label htmlFor="category">Category</Label>
//           <Select>
//             <SelectTrigger>
//               <SelectValue placeholder="Choose a category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="clothing">Clothing</SelectItem>
//               <SelectItem value="accessories">Accessories</SelectItem>
//               <SelectItem value="footwear">Footwear</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Button className="w-full md:w-auto" onClick={handlePublish}>Publish</Button>
//       </div>
//     </div>
//   );
// }



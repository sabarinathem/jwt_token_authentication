from rest_framework.decorators import api_view,permission_classes,action
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from rest_framework import status
from .serializer import RegisterSerializer,ProductSerializer,ProductVariantSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import random
import redis
from django.core.mail import send_mail
from .models import Product,ProductVariant,Category,CustomUser
from django.contrib.auth.hashers import check_password
import base64
from django.core.files.base import ContentFile
import uuid




r = redis.StrictRedis(host="localhost", port=6379, db=0, decode_responses=True)


# Api for get  Home page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def home(request):
    return Response('This is a home page')


# Api for Register for a new user
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            print('it is valid')
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# api for login 
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    if request.method == "POST":
        email = request.data.get("email")
        password = request.data.get("password")
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error':'Invalid Email'},status=status.HTTP_400_BAD_REQUEST)
        
        if not check_password(password,user.password):
            return Response({'error':'Invalid Password'},status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(email=email, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
    
 
# api for get logged in user   
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = RegisterSerializer(user)
    return Response(serializer.data)



# Function to generate a 6-digit OTP
def generate_otp():
    return str(random.randint(100000, 999999))

# # Function to send OTP via email
# def send_otp_email(email, otp):
#     subject = "Your OTP Code"
#     message = f"Your One-Time Password (OTP) is: {otp}. It is valid for 1 minutes."
#     from_email = "your-email@gmail.com"

#     send_mail(subject, message, from_email, [email])

# In api/views.py
import ssl
import certifi
from django.core.mail import send_mail

def send_otp_email(email, otp):
    subject = 'Your OTP Code'
    message = f'Your OTP is {otp}'
    from_email = 'your_email@gmail.com'  # Replace with your email
    recipient_list = [email]

    # Use certifi's CA bundle
    context = ssl.create_default_context(cafile=certifi.where())
    try:
        send_mail(
            subject,
            message,
            from_email,
            recipient_list,
            fail_silently=False,
        )
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")


@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    """
    API endpoint to generate and send OTP to an email.
    """
    print(dict(request.data))
    email = request.data.get("email")
    phone_number = request.data.get("phone_number")
    password1 = request.data.get("password1")
    password2 = request.data.get("password2")
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    is_email_exist = CustomUser.objects.filter(email=email).exists()
    is_phone_number_exist = CustomUser.objects.filter(phone_number=phone_number)
    if is_email_exist:
        return Response({'error':'Email Already Exist'},status=status.HTTP_400_BAD_REQUEST)
    elif is_phone_number_exist:
        return Response({'error':'Phone Number Already Exist'},status=status.HTTP_400_BAD_REQUEST)
    elif password1 != password2:
        return Response({'error':"Password Don't Match"},status=status.HTTP_400_BAD_REQUEST)

    otp = generate_otp()
    
    # Store OTP in Redis with a 10-minute expiry
    r.set(email, otp, ex=60)
    print(otp)

    # Send OTP to user's email
    send_otp_email(email, otp)

    return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    print("verify otp")
    
    """
    API endpoint to verify OTP.
    """
    email = request.data.get("email")
    otp_entered = request.data.get("otp")

    if not email or not otp_entered:
        return Response({"error": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Retrieve OTP from Redis
    otp_stored = r.get(email)

    if otp_stored is None:
        return Response({"error": "OTP expired or not found"}, status=status.HTTP_400_BAD_REQUEST)

    if otp_entered == otp_stored:
        r.delete(email)  # Remove OTP after successful verification
        return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
    
    
# #Product API view for Listing, Retrive a product, Update a product, Delete a product, Search the product   
# class ProductViewSet(ModelViewSet):
#     permission_classes = [AllowAny]
#     serializer_class = ProductVariantSerializer
#     queryset = ProductVariant.objects.all()
    
#     # id,name,price image 
    
#     # get all products
#     # ================
    
#     @action(detail=False,methods=['get'])
#     def get_products(self,request):
#         products = ProductVariant.objects.filter(
#                 is_active=True, 
#                 product__is_deleted=False
#             )
        
#         data = [
#             {
#                 "id": product.id,
#                 "name": product.product.name,
#                 "price": product.price,
#                 "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
#             }
#             for product in products]
#         print(data                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               )
        
#         return Response({'search_data':data}) 

    # # seach products on the basis of product name
    # # ============== 
    # @action(detail=False, methods=['get'])
    # def search_products(self,request):
    #     search = request.GET.get('search')
    #     if search:
    #         products = ProductVariant.objects.filter(product__name__icontains=search,is_active=True,product__is_deleted=False)
    #         data = [
    #         {
    #             "id": product.id,
    #             "name": product.product.name,
    #             "variant_name": product.name,
    #             "size": product.size,
    #             "color": product.color,
    #             "price": product.price,
    #             "stock_quantity": product.stock_quantity,
    #             "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
    #         }
    #         for product in products]
    #         return Response({'search_data':data}) 
    #     else:
    #         return Response({'message':'Please provide correct search input','status':status.HTTP_400_BAD_REQUEST})
        

    
#     # sort the product on the basis of product name
#     @action(detail=False, methods=['get'])
#     def sorted_by_name(self,request):
#         sort_order = request.GET.get("sort")  # Get sorting order (default: asc)
        
#         if sort_order == "desc":
#             products = ProductVariant.objects.filter(
#                 is_active=True, 
#                 product__is_deleted=False
#             ).order_by("-product__name")  # Sort Z-A
#         else:
#             products = ProductVariant.objects.filter(
#                 is_active=True, 
#                 product__is_deleted=False
#             ).order_by("product__name")  # Sort A-Z (default)
        
#         data = [
#             {
#                 "id": product.id,
#                 "name": product.product.name,
#                 "variant_name": product.name,
#                 "size": product.size,
#                 "color": product.color,
#                 "price": product.price,
#                 "stock_quantity": product.stock_quantity,
#                 "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
#             }
#             for product in products
#         ]
        
#         return Response({'sorted_data':data})
    
    
#     # sort the product on the basis of product price
#     @action(detail=False, methods=['get'])
#     def sorted_by_price(self,request):
#         sort_order = request.GET.get("sort")  # Get sorting order (default: asc)
        
#         if sort_order == "desc":
#             products = ProductVariant.objects.filter(
#                 is_active=True, 
#                 product__is_deleted=False
#             ).order_by("-price")  # Sort Z-A
#         else:
#             products = ProductVariant.objects.filter(
#                 is_active=True, 
#                 product__is_deleted=False
#             ).order_by("price")  # Sort A-Z (default)
        
#         data = [
#             {
#                 "id": product.id,
#                 "name": product.product.name,
#                 "variant_name": product.name,
#                 "size": product.size,
#                 "color": product.color,
#                 "price": product.price,
#                 "stock_quantity": product.stock_quantity,
#                 "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
#             }
#             for product in products
#         ]
        
#         return Response({'sorted_data':data})
    
    
#     # filter the product on the basis of category
#     @action(detail=False, methods=['get'])
#     def filtered_products(self,request):
#         category_id = request.GET.get("category", None)  # Get category ID from request
#         sort_order = request.GET.get("sort", "asc")  # Sorting order (default: A-Z)
        
#         products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False)
        
#         if category_id:
#             products = products.filter(product__category_id=category_id)  # Filter by category

#         if sort_order == "desc":
#             products = products.order_by("-product__name")  # Sort Z-A
#         else:
#             products = products.order_by("product__name")  # Sort A-Z (default)

#         data = [
#             {
#                 "id": product.id,
#                 "name": product.product.name,
#                 "variant_name": product.name,
#                 "size": product.size,
#                 "color": product.color,
#                 "price": product.price,
#                 "stock_quantity": product.stock_quantity,
#                 "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
#                 "category_id": product.product.category.id,
#                 "category_name": product.product.category.name,
#             }
#             for product in products
#         ]
        
#         return Response({'filtered_data':data})
    
    
#     # filter the product on the basis of price_range
#     @action(detail=False, methods=['get'])
#     def filter_products_by_price(self,request):
#         min_price = request.GET.get("min_price", None)
#         max_price = request.GET.get("max_price", None)
#         sort_order = request.GET.get("sort", "asc")  # Sorting order (default: A-Z)

#         products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False)

#         if min_price is not None:
#             products = products.filter(price__gte=min_price)  # Filter products greater than or equal to min_price
        
#         if max_price is not None:
#             products = products.filter(price__lte=max_price)  # Filter products less than or equal to max_price

#         if sort_order == "desc":
#             products = products.order_by("-product__name")  # Sort Z-A
#         else:
#             products = products.order_by("product__name")  # Sort A-Z (default)

#         data = [
#             {
#                 "id": product.id,
#                 "name": product.product.name,
#                 "variant_name": product.name,
#                 "size": product.size,
#                 "color": product.color,
#                 "price": product.price,
#                 "stock_quantity": product.stock_quantity,
#                 "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
#             }
#             for product in products
#         ]
        
#         return Response({'filtered_data':data})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_products(request):
    print(request.build_absolute_uri())
    products = ProductVariant.objects.filter(product__is_active = True,product__is_deleted = False,is_active = True)    
    product_data = [
        {
                "id": product.id,
                "name": product.product.name,
                "price": product.price,
                "category":product.product.category.name,
                "stock_quantity":product.stock_quantity,
                "image": request.build_absolute_uri(product.product.product_image.get(product=product.product,variant = product,is_primary = True).image.url) if product.product.product_image.exists() else None,
        } 
        for product in products
    ]
    
    categories = Category.objects.filter(is_active = True)
    category_data = [
        {
            "id":category.id,
            "name":category.name
        }
        for category in categories
    ]
    
    return Response({'product_list':product_data,'category_list':category_data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sort_products(request):
    sort_type = request.GET.get('sort_type')
    sort_by = request.GET.get('sort_by')
    category_id = request.GET.get('category_id')
    search = request.GET.get('search')
    
    if sort_type == 'asc' and sort_by == 'price':
        if category_id and search:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__category_id=category_id).filter(product__name__icontains=search).order_by("price")  
        elif category_id:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__category_id=category_id).order_by("price") 
        elif search:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__name__icontains=search).order_by("price") 
        else:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).order_by("price")  
        data = [
        {
                "id": product.id,
                "name": product.product.name,
                "price": product.price,
                "image": request.build_absolute_uri(product.product.product_image.get(product=product.product,variant = product,is_primary = True).image.url) if product.product.product_image.exists() else None,
        } 
        for product in products
        ]
        
    elif sort_type == 'desc' and sort_by == 'price':
        if category_id and search:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__category_id=category_id).filter(product__name__icontains=search).order_by("-price")  
        elif category_id:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__category_id=category_id).order_by("-price") 
        elif search:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__name__icontains=search).order_by("-price") 
        else:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).order_by("-price") 
        data = [
        {
                "id": product.id,
                "name": product.product.name,
                "price": product.price,
                "image": request.build_absolute_uri(product.product.product_image.get(product=product.product,variant = product,is_primary = True).image.url) if product.product.product_image.exists() else None,
        } 
        for product in products
        ]
        
    elif sort_type == 'asc' and sort_by == 'product_name':
        if category_id and search:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__category_id=category_id).filter(product__name__icontains=search).order_by("product__name")  
        elif category_id:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__category_id=category_id).order_by("product__name") 
        elif search:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__name__icontains=search).order_by("product__name") 
        else:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).order_by("product__name") 
        
        data = [
        {
                "id": product.id,
                "name": product.product.name,
                "price": product.price,
                "image": request.build_absolute_uri(product.product.product_image.get(product=product.product,variant = product,is_primary = True).image.url) if product.product.product_image.exists() else None,
        } 
        for product in products
        ]
    
    elif sort_type == 'desc' and sort_by == 'product_name':
        if category_id and search:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__category_id=category_id).filter(product__name__icontains=search).order_by("-product__name")  
        elif category_id:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__category_id=category_id).order_by("-product__name") 
        elif search:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).filter(product__name__icontains=search).order_by("-product__name") 
        else:
            products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False).order_by("-product__name") 
        data = [
        {
                "id": product.id,
                "name": product.product.name,
                "price": product.price,
                "image": request.build_absolute_uri(product.product.product_image.get(product=product.product,variant = product,is_primary = True).image.url) if product.product.product_image.exists() else None,
        } 
        for product in products
        ]
             
    return Response({'sorted_data':data})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def filtered_products(request):
    category_id = request.GET.get("category_id", None)  # Get category ID from request
    sort_order = request.GET.get("sort", "asc")  # Sorting order (default: A-Z)
    
    products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False)
    
    if category_id:
        products = products.filter(product__category_id=category_id)  # Filter by category

    if sort_order == "desc":
        products = products.order_by("-product__name")  # Sort Z-A
    else:
        products = products.order_by("product__name")  # Sort A-Z (default)

    data = [
        {
                "id": product.id,
                "name": product.product.name,
                "price": product.price,
                "image": request.build_absolute_uri(product.product.product_image.get(product=product.product,variant = product,is_primary = True).image.url) if product.product.product_image.exists() else None,
        } 
        for product in products
        ]       
    
    return Response({'filtered_data':data})


# seach products on the basis of product name
# ============== 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_products(request):
    search = request.GET.get('search')
    if search:
        products = ProductVariant.objects.filter(product__name__icontains=search,is_active=True,product__is_deleted=False)
        data = [
        {
                "id": product.id,
                "name": product.product.name,
                "price": product.price,
                "image": request.build_absolute_uri(product.product.product_image.get(product=product.product,variant = product).image.url) if product.product.product_image.exists() else None,
        }
        for product in products]
        return Response({'search_data':data}) 
    else:
        return Response({'message':'Please provide correct search input','status':status.HTTP_400_BAD_REQUEST})
    

# Reset password  
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    user = request.user
    
    old_password = request.data.get('oldPassword')
    new_password = request.data.get('newPassword')
    confirm_password = request.data.get('confirmPassword')
    print(old_password,new_password,confirm_password)
    if not old_password or not new_password or not confirm_password:
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(old_password):
        return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({'error': 'New passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)

    
# # Add Product
# @api_view(['POST'])
# @permission_classes([AllowAny])
# def add_product(request):
    
#     # Add Product 
#     # ===========
    
#     print(request.data)
#     name = request.data['name']
#     description = request.data['description']
#     user = CustomUser.objects.get(id=4)
#     category = Category.objects.get(pk=request.data['category_id'])
#     product = Product.objects.create(name=name,description=description,created_by=user,category=category)
#     print(f'Product Table data :- \nProduct_name = {name}\nProduct_description = {description}\nUser = {user}\nCategory = {category}')
    
#     # Add product variants 
#     # ====================
    
    
#     size = request.data['size']
#     color = request.data['color']
#     stock_quantity = request.data['quantity']
#     price = request.data['price']
#     ProductVariant.objects.create(name=f"{size}-{color}",size=size,color=color,stock_quantity=stock_quantity,price=price,product=product)
#     print(f'Product Variant Table data :- \nsize = {size}\ncolor = {color}\nstock quantity = {stock_quantity}\nprice = {price}')
#     # product = Product.objects.create()
#     return Response('add the product')


@api_view(['GET'])
@permission_classes([AllowAny])

def get_categories(request):
    categories = Category.objects.all()
    data = [
        {
            "id":category.id,
            "name":category.name,
            "description":category.description
        }
        
        for category in categories
    ]
    print(data)
    
    return Response(data,status=status.HTTP_200_OK)




@api_view(['GET'])
@permission_classes([AllowAny])
def product_details(request,id):
    product_details = ProductVariant.objects.get(pk = id)
    variants = ProductVariantSerializer(product_details.product.variants.all(),many=True)
    updated_variants = [
    {
        **variant,
        "variant_images": [
            {**image, "image": f'{request.build_absolute_uri('/')}media/{image["image"]}'}
            for image in variant["variant_images"]
        ],
    }
    for variant in variants.data
]
    
  

    data = {
        'product_id':product_details.product.id,
        'variants':updated_variants,
        'product_name':product_details.product.name,
        'product_price':product_details.price,
        'product_stock_quantity':product_details.stock_quantity,
        'product_images':[request.build_absolute_uri(image.image.url) for image in product_details.variant_images.all()]


    }
    return Response(data)


# class AddProductView(APIView):
#     def post(self, request, *args, **kwargs):
#         user = request.user  # Get the authenticated user

#         if not isinstance(user, CustomUser):
#             return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

#         data = request.data.copy()
#         data['created_by'] = user.id  # Ensure 'created_by' is included

#         # Fix category assignment
#         category_id = data.pop('categories', None)
#         if not category_id or not Category.objects.filter(id=category_id).exists():
#             return Response({"error": "Invalid or missing category"}, status=status.HTTP_400_BAD_REQUEST)
#         data['category'] = category_id
#         serializer = ProductSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save(created_by=user)  # Pass 'created_by' explicitly
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddProductView(APIView):
    def post(self, request, *args, **kwargs):
      
        # Assuming the user is authenticated; adjust based on your auth setup
        user = request.user  # CustomUser instance
        if not isinstance(user, CustomUser):
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
      
        # Prepare data from request
        data = request.data.copy()
        data['created_by'] = user.id  # Add the user who created the product

        # Map frontend field names to backend field names
       
        data['name'] = data.pop('productName')
        category_id = data.pop('categories', None)  # Assuming categories is an ID or list
        
      
        if not category_id or not Category.objects.filter(id=category_id).exists():
            return Response({"error": "Invalid or missing category"}, status=status.HTTP_400_BAD_REQUEST)
        data['category'] = category_id

        # Handle variants
        variants = data.get('variants', [])
       
        for variant in variants:
            variant['name'] = variant.pop('colorName')  # Map colorName to name
            variant['stock_quantity'] = variant.pop('stock')  # Map stock to stock_quantity
            # Images are already in 'images' field as base64 strings
    

        serializer = ProductSerializer(data=data,context={'request': request})
        
        if serializer.is_valid():
            
            serializer.save(variants = variants)
 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



        
    
    


   

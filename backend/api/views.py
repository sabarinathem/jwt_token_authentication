from rest_framework.decorators import api_view,permission_classes,action
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
from .models import Product,ProductVariant


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
        print(email,password)
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

# Function to send OTP via email
def send_otp_email(email, otp):
    subject = "Your OTP Code"
    message = f"Your One-Time Password (OTP) is: {otp}. It is valid for 10 minutes."
    from_email = "your-email@gmail.com"

    send_mail(subject, message, from_email, [email])


@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    """
    API endpoint to generate and send OTP to an email.
    """
    email = request.data.get("email")
    
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

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
    
    
#Product API view for Listing, Retrive a product, Update a product, Delete a product, Search the product   
class ProductViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer
    queryset = ProductVariant.objects.all()
    

    # seach products on the basis of product name
    # ============== 
    @action(detail=False, methods=['get'])
    def search_products(self,request):
        search = request.GET.get('search')
        if search:
            products = ProductVariant.objects.filter(product__name__icontains=search,is_active=True,product__is_deleted=False)
            data = [
            {
                "id": product.id,
                "name": product.product.name,
                "variant_name": product.name,
                "size": product.size,
                "color": product.color,
                "price": product.price,
                "stock_quantity": product.stock_quantity,
                "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
            }
            for product in products]
            return Response({'search_data':data}) 
        else:
            return Response({'message':'Please provide correct search input','status':status.HTTP_400_BAD_REQUEST})
        

    
    # sort the product on the basis of product name
    @action(detail=False, methods=['get'])
    def sorted_by_name(self,request):
        sort_order = request.GET.get("sort")  # Get sorting order (default: asc)
        
        if sort_order == "desc":
            products = ProductVariant.objects.filter(
                is_active=True, 
                product__is_deleted=False
            ).order_by("-product__name")  # Sort Z-A
        else:
            products = ProductVariant.objects.filter(
                is_active=True, 
                product__is_deleted=False
            ).order_by("product__name")  # Sort A-Z (default)
        
        data = [
            {
                "id": product.id,
                "name": product.product.name,
                "variant_name": product.name,
                "size": product.size,
                "color": product.color,
                "price": product.price,
                "stock_quantity": product.stock_quantity,
                "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
            }
            for product in products
        ]
        
        return Response({'sorted_data':data})
    
    
    # sort the product on the basis of product price
    @action(detail=False, methods=['get'])
    def sorted_by_price(self,request):
        sort_order = request.GET.get("sort")  # Get sorting order (default: asc)
        
        if sort_order == "desc":
            products = ProductVariant.objects.filter(
                is_active=True, 
                product__is_deleted=False
            ).order_by("-price")  # Sort Z-A
        else:
            products = ProductVariant.objects.filter(
                is_active=True, 
                product__is_deleted=False
            ).order_by("price")  # Sort A-Z (default)
        
        data = [
            {
                "id": product.id,
                "name": product.product.name,
                "variant_name": product.name,
                "size": product.size,
                "color": product.color,
                "price": product.price,
                "stock_quantity": product.stock_quantity,
                "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
            }
            for product in products
        ]
        
        return Response({'sorted_data':data})
    
    
    # filter the product on the basis of category
    @action(detail=False, methods=['get'])
    def filtered_products(self,request):
        category_id = request.GET.get("category", None)  # Get category ID from request
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
                "variant_name": product.name,
                "size": product.size,
                "color": product.color,
                "price": product.price,
                "stock_quantity": product.stock_quantity,
                "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
                "category_id": product.product.category.id,
                "category_name": product.product.category.name,
            }
            for product in products
        ]
        
        return Response({'filtered_data':data})
    
    
    # filter the product on the basis of price_range
    @action(detail=False, methods=['get'])
    def filter_products_by_price(self,request):
        min_price = request.GET.get("min_price", None)
        max_price = request.GET.get("max_price", None)
        sort_order = request.GET.get("sort", "asc")  # Sorting order (default: A-Z)

        products = ProductVariant.objects.filter(is_active=True, product__is_deleted=False)

        if min_price is not None:
            products = products.filter(price__gte=min_price)  # Filter products greater than or equal to min_price
        
        if max_price is not None:
            products = products.filter(price__lte=max_price)  # Filter products less than or equal to max_price

        if sort_order == "desc":
            products = products.order_by("-product__name")  # Sort Z-A
        else:
            products = products.order_by("product__name")  # Sort A-Z (default)

        data = [
            {
                "id": product.id,
                "name": product.product.name,
                "variant_name": product.name,
                "size": product.size,
                "color": product.color,
                "price": product.price,
                "stock_quantity": product.stock_quantity,
                "image": product.product.product_image.filter(is_primary=True).first().image.url if product.product.product_image.exists() else None,
            }
            for product in products
        ]
        
        return Response({'filtered_data':data})
        
    
    

    

        
    
    


   

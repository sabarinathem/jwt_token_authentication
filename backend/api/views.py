from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from rest_framework import status
from .serializer import RegisterSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['GET'])
@permission_classes([IsAdminUser])
def home(request):
    return Response('This is a home page')


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
    

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
   

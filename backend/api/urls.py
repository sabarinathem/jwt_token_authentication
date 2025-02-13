from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path,include
from . import views
# from rest_framework.routers import DefaultRouter
# from api.views import ProductViewSet

# router = DefaultRouter()
# router.register(r'product',ProductViewSet)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('home/',views.home,name="home"),
    path('register/',views.register,name="register"),
    path('login/',views.login,name="login"),
    path('user-profile/',views.get_user_profile,name="user-profile"),
    path('send-otp/', views.send_otp, name='send_otp'),
    path('verify-otp/',views.verify_otp,name="verify-otp"),
    path('products/',views.get_products,name="products"),
    path('sort_products/',views.sort_products,name="sort_products"),
    path('filtered_product/',views.filtered_products,name="filtered_products"),
    path('search_product/',views.search_products,name="search_products")
    # path('',include(router.urls))
]



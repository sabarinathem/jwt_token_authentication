from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


# Custom User
class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, phone_number, password=None, password2=None):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, phone_number=phone_number)

        if password and password2 and password != password2:
            raise ValueError("Passwords do not match")

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, phone_number, password=None):
        user = self.create_user(email, first_name, last_name, phone_number, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

    def __str__(self):
        return self.email
    
    

# Category
# ========

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True,blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    

# Product
# =======

class Product(models.Model):
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name='products') # one category will have many products
    name = models.CharField(max_length=255)
    description = models.TextField()
    is_active = models.BooleanField(default=True) # status
    is_deleted = models.BooleanField(default=False) #soft delete
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="created_products")
    
    def __str__(self):
        return self.name


# Product Variants
# ================

class ProductVariant(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="variants")
    size = models.CharField(max_length=100,null=True,blank=True)
    color = models.CharField(max_length=100,null=True,blank=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

# Product Image
# =============

class ProductImage(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="product_image")
    variant = models.ForeignKey(ProductVariant,on_delete=models.SET_NULL,null=True,blank=True,related_name="variant_images")
    image = models.ImageField(upload_to="images")
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.product.name} - Variant : {self.variant.name if self.variant else 'None'}"
    
    

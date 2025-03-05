from rest_framework import serializers
from .models import CustomUser,Product,ProductVariant,ProductImage
from django.core.files.base import ContentFile
import base64
import uuid
from django.http import HttpResponse

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'phone_number', 'password1', 'password2']

    def validate(self, data):
        print('validated_data :',data)
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})    
        return data

    def create(self, validated_data):
        password = validated_data["password1"]
        validated_data.pop('password1') 
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data, password=password)
        return user
    



# class ProductImageSerializer(serializers.ModelSerializer):
#     image = serializers.CharField()  # Expect base64 string from frontend

#     class Meta:
#         model = ProductImage
#         fields = ['image', 'is_primary']

#     def create(self, validated_data):
#         # Convert base64 image to a file
#         # print(validated_data["images"])
#         base64_string = validated_data.pop('image')
#         format, imgstr = base64_string.split(';base64,')
#         ext = format.split('/')[-1]  # e.g., 'jpeg'
#         filename = f"{uuid.uuid4()}.{ext}"
#         image_data = base64.b64decode(imgstr)
#         image_file = ContentFile(image_data, name=filename)

#         # Create ProductImage instance
#         product_image = ProductImage(image=image_file, **validated_data)
#         product_image.save()
#         return product_image

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.CharField()  # Expect base64 string from frontend

    class Meta:
        model = ProductImage
        fields = ['image', 'is_primary']

    def create(self, validated_data):
        base64_string = validated_data.pop('image')
        format, imgstr = base64_string.split(';base64,')
        ext = format.split('/')[-1]  # Extract file extension (e.g., 'jpeg')
        filename = f"{uuid.uuid4()}.{ext}"  # Generate unique filename
        image_data = base64.b64decode(imgstr)
        image_file = ContentFile(image_data, name=filename)

        # Create and save ProductImage instance
        validated_data['image'] = image_file
        product_image = ProductImage.objects.create(**validated_data)
        return product_image

class ProductVariantSerializer(serializers.ModelSerializer):
    variant_images = ProductImageSerializer(many=True, required=False)

    class Meta:
        model = ProductVariant
        fields = ['size', 'color', 'name', 'price', 'stock_quantity', 'variant_images']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])  # ✅ Extract images list using "images" key

        # Create the ProductVariant instance
        variant = ProductVariant.objects.create(**validated_data)

        # ✅ Process images and rename "images" to "image" before saving
        for base64_string in images_data:
            if isinstance(base64_string, str) and base64_string.startswith("data:image"):
                format, imgstr = base64_string.split(';base64,')  # ✅ Extract format
                ext = format.split('/')[-1]  # ✅ Extract file extension (e.g., jpeg, png)
                filename = f"{uuid.uuid4()}.{ext}"  # ✅ Generate a unique filename
                image_data = base64.b64decode(imgstr)  # ✅ Decode Base64 to binary
                image_file = ContentFile(image_data, name=filename)  # ✅ Convert to Django file

                # ✅ Create and save the image instance
                ProductImage.objects.create(variant=variant, image=image_file,product=variant.product)

        return variant


# class ProductVariantSerializer(serializers.ModelSerializer):
#     variant_images = ProductImageSerializer(many=True, required=False)

#     class Meta:
#         model = ProductVariant
#         fields = ['size', 'color', 'name', 'price', 'stock_quantity', 'variant_images']

#     def create(self, validated_data):
        
#         images_data = validated_data.pop('images', [])  # Get images list (default to empty list)
#         # Create the ProductVariant instance
#         variant = ProductVariant.objects.create(**validated_data)
#         # print(image_data)
#         # Check if there are images before processing
#         if images_data:
#             for image_data in images_data:
#                 # ProductImage.objects.create(
#                 #     product=variant.product,
#                 #     variant=variant,
#                 #     **image_data
#                 # )
#                 ProductImageSerializer.create()

#         return variant




class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True)

    class Meta:
        model = Product
        fields = ['category', 'name', 'description', 'variants']

    def create(self, validated_data):
        variants_data = validated_data.pop('variants')
        created_by = self.context['request'].user  # Get the authenticated user
        product = Product.objects.create(created_by=created_by, **validated_data)  # Ensure created_by is set

        for variant_data in variants_data:
            variant_data['product'] = product
            ProductVariantSerializer().create(variant_data)

        return product


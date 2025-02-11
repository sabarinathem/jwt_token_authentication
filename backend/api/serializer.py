from rest_framework import serializers
from .models import CustomUser,Product,ProductVariant

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'phone_number', 'password1', 'password2']

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})    
        return data

    def create(self, validated_data):
        print(validated_data)
        password = validated_data["password1"]
        validated_data.pop('password1') 
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data, password=password)
        return user
    

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        
        

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = "__all__"
        depth = 1

from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model  
from rest_framework import serializers  
  
  
User = get_user_model()  
  
  
class RegisterSerializer(serializers.ModelSerializer):  
    password = serializers.CharField(  
        write_only=True,  
        min_length=8,  
    )  
  
    password_confirm = serializers.CharField(  
        write_only=True,  
    )  
  
    class Meta:  
        model = User  
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name')  
  
    def validate(self, data):  
        if data['password'] != data['password_confirm']:  
            raise serializers.ValidationError("Passwords do not match.")  
        return data  
  
    def create(self, validated_data):  
        validated_data.pop('password_confirm', None)  
        password = validated_data.pop('password')  
        user = User.objects.create_user(password=password, **validated_data)  
        return user 



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self,data):
        username = data.get("username")
        password = data.get("password")

        user = authenticate(
            username = username,
            password = password
        )

        if user is None:
            raise serializers.ValidationError("Invalid credentials.")
        
        data["user"] = user
        return data
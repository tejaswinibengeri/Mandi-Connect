from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'phone', 'location', 'role', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    """Full profile serializer — used for view and update."""
    class Meta:
        model = User
        fields = (
            'id', 'name', 'phone', 'email', 'location', 'role',
            'profile_photo', 'aadhaar_number', 'aadhaar_image', 'is_verified',
            'upi_id', 'account_holder_name', 'bank_name',
            'account_number', 'ifsc_code', 'upi_qr_code',
        )
        read_only_fields = ('id', 'role', 'phone', 'is_verified')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        token['role'] = user.role
        token['user_id'] = user.id
        return token

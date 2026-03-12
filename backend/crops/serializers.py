from rest_framework import serializers
from .models import Crop

class CropSerializer(serializers.ModelSerializer):
    farmer_name = serializers.ReadOnlyField(source='farmer.name')
    
    class Meta:
        model = Crop
        fields = ['id', 'farmer', 'farmer_name', 'crop_name', 'quantity', 'price', 'location', 'image', 'created_at']
        extra_kwargs = {'farmer': {'required': False}}

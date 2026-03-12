from rest_framework import serializers
from .models import Crop

class CropSerializer(serializers.ModelSerializer):
    farmer_name = serializers.ReadOnlyField(source='farmer.name')
    
    class Meta:
        model = Crop
        fields = '__all__'
        extra_kwargs = {'farmer': {'required': False}}

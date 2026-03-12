from rest_framework import serializers
from .models import Order, Transport, PaymentHistory
from crops.serializers import CropSerializer


class TransportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = '__all__'
        extra_kwargs = {'order': {'required': False}}


class PaymentHistorySerializer(serializers.ModelSerializer):
    crop_name = serializers.ReadOnlyField(source='crop.crop_name')
    farmer_name = serializers.ReadOnlyField(source='farmer.name')
    farmer_qr_code = serializers.ImageField(source='farmer.upi_qr_code', read_only=True)
    retailer_name = serializers.ReadOnlyField(source='retailer.name')

    class Meta:
        model = PaymentHistory
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    crop_details = CropSerializer(source='crop', read_only=True)
    retailer_name = serializers.ReadOnlyField(source='retailer.name')
    farmer_name = serializers.ReadOnlyField(source='crop.farmer.name')
    transport = TransportSerializer(read_only=True)
    payment = PaymentHistorySerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        extra_kwargs = {'retailer': {'required': False}}

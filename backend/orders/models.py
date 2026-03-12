from django.db import models
from django.conf import settings
from crops.models import Crop


class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Delivered', 'Delivered'),
    )
    retailer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='orders')
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.crop.crop_name} by {self.retailer.name}"


class Transport(models.Model):
    DELIVERY_STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Pickup Scheduled', 'Pickup Scheduled'),
        ('In Transit', 'In Transit'),
        ('Delivered', 'Delivered'),
    )
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='transport')
    retailer_name = models.CharField(max_length=255, null=True, blank=True)
    pickup_location = models.CharField(max_length=500, null=True, blank=True)
    delivery_address = models.CharField(max_length=500, null=True, blank=True)
    driver_name = models.CharField(max_length=255)
    vehicle_number = models.CharField(max_length=50)
    driver_contact = models.CharField(max_length=15)
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transport for Order #{self.order.id} - {self.delivery_status}"


class PaymentHistory(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
    )
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    crop = models.ForeignKey(Crop, on_delete=models.SET_NULL, null=True, related_name='payments')
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='received_payments')
    retailer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='made_payments')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    upi_link = models.TextField(blank=True, null=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Pending')
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment #{self.id} - Order #{self.order.id} - {self.payment_status}"

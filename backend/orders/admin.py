from django.contrib import admin
from .models import Order, Transport, PaymentHistory


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'retailer', 'crop', 'quantity', 'total_price', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('retailer__name', 'crop__crop_name')


@admin.register(Transport)
class TransportAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'driver_name', 'vehicle_number', 'driver_contact', 'delivery_status')
    list_filter = ('delivery_status',)


@admin.register(PaymentHistory)
class PaymentHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'farmer', 'retailer', 'amount_paid', 'payment_status', 'payment_date')
    list_filter = ('payment_status',)

from django.contrib import admin
from .models import Crop

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'farmer', 'quantity', 'price', 'location', 'created_at')
    list_filter = ('location',)
    search_fields = ('crop_name', 'farmer__name')

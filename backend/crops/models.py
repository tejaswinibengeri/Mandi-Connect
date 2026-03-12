from django.db import models
from django.conf import settings

class Crop(models.Model):
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='crops')
    crop_name = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2) # in kg
    price = models.DecimalField(max_digits=10, decimal_places=2) # per kg
    location = models.CharField(max_length=255)
    image = models.ImageField(upload_to='crops/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.crop_name} by {self.farmer.name}"

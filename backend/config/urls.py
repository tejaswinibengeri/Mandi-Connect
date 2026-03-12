from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from django.views.generic import TemplateView

from users.views import register_user, MyTokenObtainPairView, profile, chatbot
from crops.views import get_crops, add_crop, update_crop, delete_crop
from orders.views import (
    place_order, get_orders, update_order_status, delete_order,
    add_transport, update_transport_status, get_transport,
    get_payment_history, mark_payment_paid, crop_history
)

def home_api(request):
    return HttpResponse("Mandi Connect API is Running 🚀")

urlpatterns = [
    path('api/status/', home_api),
    path('admin/', admin.site.urls),

    # Auth APIs
    path('api/register/', register_user),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/profile/', profile),
    path('api/chatbot/', chatbot),

    # Crops APIs
    path('api/crops/', get_crops),
    path('api/add-crop/', add_crop),
    path('api/update-crop/<int:pk>/', update_crop),
    path('api/delete-crop/<int:pk>/', delete_crop),

    # Orders APIs
    path('api/place-order/', place_order),
    path('api/orders/', get_orders),
    path('api/update-order-status/<int:pk>/', update_order_status),
    path('api/delete-order/<int:pk>/', delete_order),

    # Transport APIs
    path('api/transport/<int:order_id>/', add_transport),
    path('api/transport/status/<int:pk>/', update_transport_status),
    path('api/transport/get/<int:order_id>/', get_transport),

    # Payment APIs
    path('api/payments/', get_payment_history),
    path('api/payments/paid/<int:pk>/', mark_payment_paid),

    # Crop History
    path('api/history/crops/', crop_history),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve React index.html for all other routes
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
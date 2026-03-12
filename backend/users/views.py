from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, ProfileSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import os


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        data = request.data.copy()

        if "phone" in data:
            data["username"] = data["phone"]

        request._full_data = data

        return super().post(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    if request.method == 'GET':
        serializer = ProfileSerializer(user, context={'request': request})
        return Response(serializer.data)
    else:
        serializer = ProfileSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def chatbot(request):
    user_message = request.data.get('message', '').lower()
    
    # Strictly Rule-Based Help Assistant
    pre_programmed_responses = {
        "how do i add crops": "To add crops: 1. Login as Farmer 2. Go to 'Add Crop' page 3. Fill in crop name, price, and quantity 4. Click Submit.",
        "how do i buy crops": "To buy crops: 1. Login as Retailer 2. Browse the 'Marketplace' 3. Click 'Buy' on the desired crop 4. Complete the UPI payment.",
        "how does transportation work": "After you place an order, you can add driver and vehicle details. Both farmers and retailers can track the 'In Transit' and 'Delivered' status in the History section.",
        "how do i receive payment": "Retailers pay via the UPI QR code shown after ordering. Farmers can verify payments in their 'History' section and mark them as paid.",
        "i need help placing an order": "Make sure you are a registered Retailer. Go to the Marketplace, choose your crop, and click 'Place Order'. You will then see the payment QR code.",
        "how can i update my profile": "Go to the 'Profile' section from the menu and click 'Edit Profile'. You can update your Aadhaar, UPI details, and even upload your Payment QR Code.",
        "hello": "Hello! I am the MandiConnect Assistant. How can I help you today? You can ask about adding crops, buying, payments, or transportation.",
        "hi": "Hi there! Need help with MandiConnect? Ask me about crop listings, orders, or UPI payments.",
    }
    
    # Check for direct matches
    for key, val in pre_programmed_responses.items():
        if key in user_message:
            return Response({"response": val})
            
    # If no rule matches, provide platform support fallback
    return Response({"response": "I'm sorry, I don't have a specific answer for that. Please contact MandiConnect platform support for further assistance."})

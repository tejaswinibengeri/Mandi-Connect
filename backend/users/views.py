from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, ProfileSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import os
from dotenv import load_dotenv

load_dotenv()

def get_chatbot_client():
    try:
        import openai
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key and "your_openai_api_key" not in api_key:
            return openai.OpenAI(api_key=api_key)
    except Exception:
        pass
    return None


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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
        serializer = ProfileSerializer(user)
        return Response(serializer.data)
    else:
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def chatbot(request):
    user_message = request.data.get('message', '').lower()
    
    pre_programmed_responses = {
        "how do i add crops": "To add crops, visit the 'Add Crop' page while logged in as a Farmer. Fill in the crop name, price, and quantity, then submit the form.",
        "how do i buy crops": "To buy crops, browse the 'Marketplace' as a Retailer, select the crop you need, click 'Buy', and complete the payment process.",
        "how does transportation work": "Once an order is placed, transportation tracking begins. You can view the delivery status in your 'History' or 'Orders' section.",
        "how do i receive payment": "Payments are made via UPI. Once a retailer completes the payment, the farmer is notified and the status is updated in the system.",
        "i need help placing an order": "To place an order, go to the Marketplace, choose a crop, specify the quantity, and proceed with the UPI payment.",
        "how can i update my profile": "You can update your profile details like Aadhaar or UPI ID by going to the 'Profile' section and clicking 'Edit Profile'."
    }
    
    # Check for direct matches first
    for key, val in pre_programmed_responses.items():
        if key in user_message:
            return Response({"response": val})
            
    # AI Fallback
    client = get_chatbot_client()
    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant for MandiConnect, a farm-to-retail marketplace. Help users with adding crops, buying, payments, and transport. If you cannot answer a query reliably or it's unrelated to MandiConnect, respond with: 'Please contact platform support for further assistance.'"},
                    {"role": "user", "content": request.data.get('message', '')}
                ]
            )
            ai_reply = response.choices[0].message.content
            return Response({"response": ai_reply})
        except Exception as e:
            print(f"AI Chatbot error: {e}")
            pass
            
    # Final Fallback
    return Response({"response": "Please contact platform support for further assistance."})

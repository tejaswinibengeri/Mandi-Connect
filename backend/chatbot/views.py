import os
import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

# Set OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = """
You are the MandiConnect AI Assistant. MandiConnect is a Direct Farm-to-Retail Marketplace where farmers can sell crops directly to retailers.

Help farmers and retailers understand how to use the platform. Here are some key features:
1. farmers can add crops via the 'Add Crop' page.
2. Retailers can browse and buy crops in the 'Marketplace'.
3. Transportation is tracked for every order.
4. Payments are handled via a secure UPI payment system.
5. Users have a profile where they can update their details.
6. Users can view their crop listings and payment history in the 'History' section.

Rules:
- Be helpful and polite.
- If a user asks something not related to MandiConnect, try to relate it or answer generally but keep focus on the platform.
- If you don't know the answer or it requires human intervention, say: "Please contact platform support for further assistance."
- Provide step-by-step instructions for platform tasks.

Common Tasks:
- Add Crops: Login as farmer -> Dashboard -> Add Crop -> Fill details -> Submit.
- Buy Crops: Login as retailer -> Marketplace -> Select Crop -> Click Buy -> Complete UPI Payment.
- Track Order: Go to History -> Find Order -> Check Transportation Status.
- Update Profile: Go to Profile page (top right menu) -> Edit details -> Save.
"""

class ChatbotView(APIView):
    permission_classes = [] # Allow all for now, or restrict to authenticated users

    def post(self, request):
        message = request.data.get("message")
        if not message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if not openai.api_key:
                # Return a friendly message if API key is missing
                return Response({
                    "response": "Chatbot is currently in maintenance mode (API Key missing). Please contact platform support for further assistance."
                })

            client = openai.OpenAI(api_key=openai.api_key)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message},
                ]
            )
            
            ai_reply = response.choices[0].message.content
            return Response({"response": ai_reply})

        except Exception as e:
            print(f"Chatbot Error: {str(e)}")
            return Response({
                "response": "Please contact platform support for further assistance."
            }, status=status.HTTP_200_OK) # returning 200 with the required fallback message

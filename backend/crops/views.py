from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Crop
from .serializers import CropSerializer

@api_view(['GET'])
def get_crops(request):
    crops = Crop.objects.filter(quantity__gt=0).order_by('-created_at')
    serializer = CropSerializer(crops, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_crop(request):
    if request.user.role != 'farmer':
        return Response({'error': 'Only farmers can add crops'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = CropSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(farmer=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_crop(request, pk):
    try:
        crop = Crop.objects.get(pk=pk, farmer=request.user)
    except Crop.DoesNotExist:
        return Response({'error': 'Crop not found or permission denied'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CropSerializer(crop, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_crop(request, pk):
    try:
        crop = Crop.objects.get(pk=pk, farmer=request.user)
    except Crop.DoesNotExist:
        return Response({'error': 'Crop not found or permission denied'}, status=status.HTTP_404_NOT_FOUND)
    
    crop.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

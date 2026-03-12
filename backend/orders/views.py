from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Order, Transport, PaymentHistory
from .serializers import OrderSerializer, TransportSerializer, PaymentHistorySerializer
from crops.models import Crop


# ─── Orders ────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    if request.user.role != 'retailer':
        return Response({'error': 'Only retailers can place orders'}, status=status.HTTP_403_FORBIDDEN)

    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        crop = serializer.validated_data['crop']
        quantity = serializer.validated_data['quantity']

        if crop.quantity < quantity:
            return Response({'error': 'Not enough quantity available'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = quantity * crop.price
        order = serializer.save(retailer=request.user, total_price=total_price)

        # Deduct crop quantity
        crop.quantity -= quantity
        crop.save()

        # Auto-create a pending PaymentHistory record
        farmer = crop.farmer
        upi_link = ''
        if farmer.upi_id:
            upi_link = f"upi://pay?pa={farmer.upi_id}&pn={farmer.name}&am={total_price}&cu=INR"

        PaymentHistory.objects.create(
            order=order,
            crop=crop,
            farmer=farmer,
            retailer=request.user,
            amount_paid=total_price,
            upi_link=upi_link,
            payment_status='Pending',
        )

        return Response(OrderSerializer(Order.objects.get(pk=order.id)).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    # Only show active orders (not Delivered)
    if request.user.role == 'farmer':
        orders = Order.objects.filter(crop__farmer=request.user).exclude(status='Delivered').order_by('-created_at')
    else:
        orders = Order.objects.filter(retailer=request.user).exclude(status='Delivered').order_by('-created_at')

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_order(request, pk):
    try:
        # Both retailer and farmer can delete, though typically retailer would cancel before shipped.
        # We will allow either based on ownership.
        if request.user.role == 'farmer':
            order = Order.objects.get(pk=pk, crop__farmer=request.user)
        else:
            order = Order.objects.get(pk=pk, retailer=request.user)
            
        # Refund the crop quantity
        crop = order.crop
        crop.quantity += order.quantity
        crop.save()
        
        order.delete()
        return Response({'message': 'Order deleted successfully'}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found or permission denied'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_order_status(request, pk):
    try:
        order = Order.objects.get(pk=pk, crop__farmer=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status in ['Accepted', 'Delivered']:
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)
    return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


# ─── Transport ─────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_transport(request, order_id):
    try:
        order = Order.objects.get(pk=order_id, retailer=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found or permission denied'}, status=status.HTTP_404_NOT_FOUND)

    # Update if already exists
    transport_qs = Transport.objects.filter(order=order)
    if transport_qs.exists():
        serializer = TransportSerializer(transport_qs.first(), data=request.data, partial=True)
    else:
        serializer = TransportSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(order=order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_transport_status(request, pk):
    try:
        transport = Transport.objects.get(pk=pk)
        # Only farmer who owns the crop can update
        if transport.order.crop.farmer != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    except Transport.DoesNotExist:
        return Response({'error': 'Transport not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('delivery_status')
    valid_statuses = ['Pending', 'Pickup Scheduled', 'In Transit', 'Delivered']
    if new_status in valid_statuses:
        transport.delivery_status = new_status
        transport.save()
        
        # Move order to history by marking it Delivered
        if new_status == 'Delivered':
            transport.order.status = 'Delivered'
            transport.order.save()
            
        return Response(TransportSerializer(transport).data)
    return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transport(request, order_id):
    try:
        order = Order.objects.get(pk=order_id)
        # Farmer or retailer of this order can view
        if order.crop.farmer != request.user and order.retailer != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        transport = Transport.objects.get(order=order)
        return Response(TransportSerializer(transport).data)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Transport.DoesNotExist:
        return Response({'error': 'No transport assigned yet'}, status=status.HTTP_404_NOT_FOUND)


# ─── Payment History ───────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_history(request):
    if request.user.role == 'farmer':
        payments = PaymentHistory.objects.filter(farmer=request.user).order_by('-payment_date')
    else:
        payments = PaymentHistory.objects.filter(retailer=request.user).order_by('-payment_date')
    serializer = PaymentHistorySerializer(payments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_payment_paid(request, pk):
    try:
        payment = PaymentHistory.objects.get(pk=pk, retailer=request.user)
    except PaymentHistory.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)

    payment.payment_status = 'Paid'
    payment.save()
    return Response(PaymentHistorySerializer(payment).data)


# ─── Crop History ──────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def crop_history(request):
    """
    Farmers: all crops they have listed.
    Retailers: crops they have purchased (via orders).
    """
    from crops.models import Crop
    from crops.serializers import CropSerializer

    if request.user.role == 'farmer':
        crops = Crop.objects.filter(farmer=request.user).order_by('-created_at')
        data = []
        for crop in crops:
            has_orders = crop.orders.exists()
            data.append({
                'id': crop.id,
                'crop_name': crop.crop_name,
                'quantity': crop.quantity,
                'price': crop.price,
                'location': crop.location,
                'created_at': crop.created_at,
                'status': 'sold' if has_orders else 'active',
                'image': crop.image.url if crop.image else None,
            })
        return Response(data)
    else:
        # Retailer: crops they ordered
        orders = Order.objects.filter(retailer=request.user).select_related('crop').order_by('-created_at')
        data = []
        for order in orders:
            crop = order.crop
            data.append({
                'order_id': order.id,
                'crop_name': crop.crop_name,
                'quantity_ordered': order.quantity,
                'price': crop.price,
                'total_price': order.total_price,
                'farmer_name': crop.farmer.name,
                'location': crop.location,
                'created_at': order.created_at,
                'order_status': order.status,
                'image': crop.image.url if crop.image else None,
            })
        return Response(data)

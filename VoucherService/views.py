from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from .helper import *

@method_decorator(csrf_exempt, name='dispatch')
class create_voucher(APIView):
    """CREATE NEW VOUCHER"""
    def post(self, request):
        name = request.data.get('name')
        discount = request.data.get('discount')
        description = request.data.get('description')
        field = {
            "name": name,
            "discount": discount,
            "code": generate_code(4),
            "description": description
        }
        serializer = VoucherServiceSerializer(data=field)
        if serializer.is_valid():
            if save_voucher(field["name"], field["description"], field["code"], field["discount"]):
                return Response({
                    "success": True,
                    "message": "Voucher saved successfully",
                    "data": field
                })
            else:
                return Response({
                    "success": False,
                    "message": "Voucher not saved successfully",
                },status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST) 
        
    """GET ACTIVE VOUCHER"""
    def get(self, request):
        field = {
            "is_active": True
        }
        update_field = {
            "status":"Nothing to update"
        }
        return Response({
            "success": True,
            "message": "The Active voucher",
            "data": get_active_voucher(field,update_field)
        })
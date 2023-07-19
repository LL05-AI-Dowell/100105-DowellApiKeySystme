from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .serializers import *
from utils.helper import * 


"""
@name: Generate Vocucher 
@description: To generate a vocucher
"""
@method_decorator(csrf_exempt, name='dispatch')
class generateVoucher(APIView):
    def post(self, request):
        voucher_name = request.data.get('voucher_name')
        voucher_discount = request.data.get('voucher_discount')

        try:
            Voucher.objects.get(voucher_name=voucher_name)
            
        except Voucher.DoesNotExist:
            pass

        Voucher.objects.filter(is_active=True).update(is_active=False)

        field = {
            "voucher_name": voucher_name,
            "voucher_code": generate_voucher_code(6),
            "voucher_discount": voucher_discount,
            "is_active": True
        }

        serializer = VoucherSerializer(data=field)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Successfully created voucher",
                "data": field
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success": False,
                "message": "Voucher was not created successfully",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):
        vouchers = Voucher.objects.all()
        return Response({
            "success": True,
            "message": "list of voucher",
            "data": list(vouchers.values())
        })
    
"""
@name: Redeem voucher
@description: To redeem a voucher by user
"""
@method_decorator(csrf_exempt, name='dispatch')
class redeemVoucher(APIView):
    def post(self, request,userid):
        name = request.data.get('name')
        email = request.data.get('email')

        vouchers = Voucher.objects.filter(is_active=True)
        active_voucher = vouchers.first() if vouchers.exists() else None

        field = {
            "userId": userid,
            "name": name,
            "email": email,
            "voucher_code": active_voucher.voucher_code if active_voucher else None
        }

        serializer = RedeemVoucherSerializer(data=field)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Voucher Redeemed successfully",
                "data": field
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success":False,
                "message":"You cannot redeem this voucher",
                "error":serializer.errors
                },status=status.HTTP_200_OK)
                 
"""uncomment when api system is ready"""
    # def get(self, request, userid):
    #     try:
    #         redeemVouchers = RedeemVoucher.objects.filter(userId=userid)
    #     except ApiKey.DoesNotExist:
    #         return Response({
    #             "success": True,
    #             "message": "You haven't redeemed any voucher."
    #         }, status=status.HTTP_404_NOT_FOUND)
    #     return Response({
    #         "success": True,
    #         "message": "Here is your voucher",
    #         "data": list(redeemVouchers.values())
    #     }, status=status.HTTP_200_OK)
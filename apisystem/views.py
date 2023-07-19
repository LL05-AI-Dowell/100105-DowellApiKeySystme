from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render , get_object_or_404
from utils.helper import *
from service.models import *
from vouchersystem.models import *
from .serializers import *
from .helper import *


"""
@Generate API key
@description: To generate API key and activate/deactivate it
"""
@method_decorator(csrf_exempt, name='dispatch')
class generateKey(APIView):
    def post(self, request,userid):
        username = request.data.get('username')
        email = request.data.get('email')
        userDetails = request.data.get('userDetails')

        APIKey = generate_uuid()
        
        field = {
            "username": username,
            "email": email,
            "userId":userid,
            "APIKey": APIKey,
            "userDetails": userDetails,
            "api_services" : get_api_sevices(),
            "modules" : get_modules(),
            "products" : get_products(),
        }

        serializer = ApiKeySerializer(data=field)
        if serializer.is_valid():
            serializer.save()
            # mail_status = send_email(email, name, APIKey,api_services)
            mail_status=True
            if mail_status:
                return Response({
                    "success": True,
                    "message": "The API Key has been sent to your email",
                    "Api_Key" :APIKey
                })
            else: 
                return Response({
                    "success": False,
                    "message": "Contact the admin"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({
                "success": False,
                "message": "You already have an API Key",
                "error": serializer.errors
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request, userid):
        try:
            api_key = APIKEY.objects.filter(userId=userid)
            print("---Got apiKey---",api_key)
        except APIKEY.DoesNotExist:
            return Response("API Key not found.", status=status.HTTP_404_NOT_FOUND)
        if (api_key.values()):
            return Response({
                "success": True,
                "message": "List of api keys found",
                "data": list(api_key.values())
            },status=status.HTTP_200_OK)
        else: 
            return Response({
                "success": False,
                "message": "No API key found"
            },status=status.HTTP_200_OK)
        
    def put(self, request,userid):
        APIKey = request.data.get('api_key')
        voucher_code = request.data.get('voucher_code', None)

        try:
            api_key = APIKEY.objects.get(userId=userid, APIKey=APIKey)
        except APIKEY.DoesNotExist:
            return Response({
                "success": False,
                "message": "No API key found",
            }, status=status.HTTP_404_NOT_FOUND)
     
        if not voucher_code:
            credits = 0
            total_credits = 0
        else:     
            voucher = get_object_or_404(Voucher, voucher_code=voucher_code)
            print(voucher)
            if not voucher.is_active:
                return Response({
                    "success": False,
                    "message": "The voucher is not active"
                }, status=status.HTTP_400_BAD_REQUEST)
            credits = voucher.voucher_discount
            total_credits = voucher.voucher_discount

        if not api_key.is_redeemed : 
            api_key.is_redeemed = True
            api_key.is_active = True
            api_key.credits = credits
            api_key.total_credits = total_credits
            api_key.save()

            return Response({
                "success": True,
                "message": "API key has been updated successfully.",
                "data": ApiKeySerializer(api_key).data
            }, status=status.HTTP_200_OK)
        else:
            api_key.is_active = not api_key.is_active
            api_key.save()
            return Response({
                "success": True,
                "message": "API key active status has been updated successfully",
                "data": ApiKeySerializer(api_key).data
            }, status=status.HTTP_200_OK)
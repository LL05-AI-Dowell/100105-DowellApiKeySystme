from django.shortcuts import render
import os
from django.shortcuts import render , get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
from app.helper import *
from .models import ApiKey,Document
from .serializers import *
from django.core.serializers import serialize


@method_decorator(csrf_exempt, name='dispatch')
class generateKey(APIView):
    def post(self, request):
        username = request.data.get('username')
        userId = request.data.get('userId')
        email = request.data.get('email')
        userDetails = request.data.get('userDetails')

        Api_service =Document.objects.all()
        Api_service_json=serialize('json', Api_service)
        print(Api_service_json)

        APIKey = generate_uuid()

        field = {
            "username": username,
            "email": email,
            "userId":userId,
            "APIKey": APIKey,
            "userDetails": userDetails,
            "api_services":Api_service_json
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
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, userId):
        try:
            api_key = ApiKey.objects.filter(userId=userId)
            print("---Got apiKey---",api_key)
        except ApiKey.DoesNotExist:
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
        
    def put(self, request):
        userId = request.data.get('userId')
        APIKey = request.data.get('APIKey')
        voucher_code = request.data.get('voucher_code')

        try:
            api_key = ApiKey.objects.get(userId=userId, APIKey=APIKey)
        except ApiKey.DoesNotExist:
            return Response("Invalid credentials or API Key not found.", status=status.HTTP_404_NOT_FOUND)
     
        if not voucher_code:
            credits = 0
        else:     
            voucher = get_object_or_404(Voucher, voucher_code=voucher_code)
            print(voucher)
            if not voucher.is_active:
                return Response({
                    "success": False,
                    "message": "The voucher is not active"
                }, status=status.HTTP_400_BAD_REQUEST)
            credits = voucher.voucher_discount

        api_key.is_active = True
        api_key.credits = credits
        api_key.save()

        return Response({
            "success": True,
            "message": "API key has been updated successfully.",
            "data": ApiKeySerializer(api_key).data
        }, status=status.HTTP_200_OK)

        
    
    
@method_decorator(csrf_exempt, name='dispatch')
class processapikey(APIView):
    def post(self, request):
        user_api_key = request.data.get("api_key")
        user_api_services = request.data.get("api_services")
        field = {
            "user_api_key": user_api_key,
            "user_api_services": user_api_services
        }
        serializer = ProcessAPIKeySerializer(data=field)
        if serializer.is_valid():
            try:
                api_key = ApiKey.objects.get(APIKey=user_api_key, api_services= user_api_services)
                print("---Got api key---",api_key)
            except ApiKey.DoesNotExist:
                return Response({
                    "success": False,
                    "message": "API key does not exist or the combination is invalid"
                }, status=status.HTTP_404_NOT_FOUND)
            if(api_key.is_active):
                if(api_key.credits > 0):
                    api_key.credits -= 1
                    api_key.save()
                    serializer = ApiKeySerializer(api_key)
                    return Response({
                        "success": True,
                        "message": "The count is decremented",
                        "count": serializer.data["credits"]
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "success":False,
                        "message":"Limit exceeded",
                    }, status=status.HTTP_401_UNAUTHORIZED)
            return Response({
                "success": True,
                "message": "API key is inactive"
            }, status= status.HTTP_403_FORBIDDEN)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class generateVoucher(APIView):
    def post(self, request):
        voucher_name = request.data.get('voucher_name')
        voucher_discount = request.data.get('voucher_discount')

        # Seting the previous voucher to False if available
        if Voucher.objects.filter(is_active=True).exists():
            Voucher.objects.filter(is_active=True).update(is_active=False)

        field = {
            "voucher_name": voucher_name,
            "voucher_code": generate_voucher_code(6),
            "voucher_discount": voucher_discount,
            "is_active": True  # Set the new voucher to active
        }

        serializer = VoucherSerializer(data=field)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "successfully created voucher",
                "data": field
            }, status=status.HTTP_201_CREATED)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            vouchers = Voucher.objects.all()
            return Response({
                "success": True,
                "message": "list of voucher",
                "data": list(vouchers.values())
            })

        except ApiKey.DoesNotExist:
            return Response("API Key not found.", status=status.HTTP_404_NOT_FOUND)


@method_decorator(csrf_exempt, name='dispatch')
class redeemVoucher(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')

        vouchers = Voucher.objects.filter(is_active=True)
        active_voucher = vouchers.first() if vouchers.exists() else None

        field = {
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
                 

    def get(self, request, email):
        try:
            redeemVouchers = RedeemVoucher.objects.filter(email=email)
        except ApiKey.DoesNotExist:
            return Response({
                "success": True,
                "message": "You haven't redeemed any voucher."
            }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "success": True,
            "message": "Here is your voucher",
            "data": list(redeemVouchers.values())
        }, status=status.HTTP_200_OK)
    

class ActivateService(APIView):
    def put(self, request):
        email = request.data.get('email')
        APIKey = request.data.get('APIKey')
        voucher_code = request.data.get('voucher_code', None)

        try:
            api_key = ApiKey.objects.get(email=email, APIKey=APIKey)
        except APIKey.DoesNotExist:
            return Response("Invalid credentials or API Key not found.", status=status.HTTP_404_NOT_FOUND)

        if not voucher_code:
            credits = 0
        else:
            voucher = get_object_or_404(Voucher, voucher_code=voucher_code)

            if not voucher.is_active:
                return Response({
                    "success": False,
                    "message": "The voucher is not active"
                }, status=status.HTTP_400_BAD_REQUEST)
            credits = voucher.voucher_discount

        if  api_key.is_active == True:
            if credits > 0 or credits == 0:
                api_services_data = api_key.api_services
                api_services = json.loads(api_services_data)

                for service in api_services:
                    service['fields']['is_active'] = True

                api_key.api_services = json.dumps(api_services)
                api_key.save()

                
                
                return Response("API Key and associated services activated successfully.")
            else:
                return Response("You don't have enough credit to activate the API Key.")
            
        else:
                return Response("First you need to generate the api key")
       

@method_decorator(csrf_exempt, name='dispatch')
class DocumentDetails(APIView):

    def post(self, request):
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        documents = Document.objects.all()
        serializer = DocumentSerializer(documents, many=True)

        return Response({
            "success": True,
            "message": "List of Services",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from utils.helper import *
from .helper import *
from Service.helper import *

@method_decorator(csrf_exempt, name='dispatch')
class create_user_api_key(APIView):
    def post(self, request):
        type_request = request.GET.get('type')

        if type_request == "create_api_key":
            return self.create_api_key(request)
        elif type_request == "activate_key":
            return self.activate_key(request)
        elif type_request == "deactivate_key":
            return self.deactivate_key(request)
        else:
            return self.handle_error(request)
        
    """CREATE API KEY FOR USER"""
    def create_api_key(self, request):
        username= request.data.get('username')
        email= request.data.get('email')
        userId = request.data.get('userId')
        userDetails = request.data.get('userDetails')

        field= {
            "username": username,
            "email": email,
            "userId": userId,
            "userDetails": userDetails
        }
        APIKey = generate_uuid()
        print("API KEY ",APIKey)
        serializer = UserAPIKeySerializer(data=field)
        if serializer.is_valid():
            response = save_user_key(APIKey,field["username"],field["email"], field["userId"],field["userDetails"])
            if response['success']:
                return Response({
                    "success": True,
                    "message": response['message'],
                    "data": response["data"]
                },status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "success": True,
                    "message": response['message'],
                    "data": response["data"]
                },status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST)

    """ACTIVATE API KEY"""
    def activate_key(self, request):
        api_key = request.GET.get("api_key")
        voucher = request.data.get("voucher", None)

        if voucher is None:
            field = {
                "api_key": api_key
            }
            update_field = {
                "is_active": True,
                "is_redeemed": False,
                "total_credits": 0,
                "used_credits": 0,
                "services": get_services()
            }
        else:
            response = get_voucher_discount(voucher)
            if not response["success"]:
                return Response({
                    "success": False,
                    "message": response["message"]
                })
            field = {
                "api_key": api_key
            }
            update_field = {
                "is_active": True,
                "is_redeemed": True,
                "total_credits": response['data'],
                "used_credits": response['data'],
                "services": get_services()
            }
        response = activate_key(field, update_field)
        if response["success"]:
            return Response({
                "success": True,
                "message": response["message"]
            })
        else:
            return Response({
                "success": False,
                "message": response["message"]
            })

    """DEACTIVATE THE API KEY"""
    def deactivate_key(self, request):
        api_key = request.GET.get("api_key")
        field ={
            "api_key": api_key
        }
        update_field = {
            "is_active": False
        }
        response = deactivate_key(field,update_field)
        return Response(response)

    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
    

@method_decorator(csrf_exempt, name='dispatch')
class test(APIView):
    def get(self, request):
        field = {
            "api_key": "1e33e5c6-68f8-4ace-98c9-c980a5f70f1e",
        }
        update_field = {
            "status": "Nothing to retrieve",
        }
        response = json.loads(dowellconnection(*User_Services, "find", field, update_field))

        print("Response", response["data"]["services"])

        service = get_services()

        print("Service", service)

        response_service_ids = {s["ids"] for s in response["data"]["services"]}
        new_services = [s for s in service if s["ids"] not in response_service_ids]

        print(new_services)

        response["data"]["services"].extend(new_services)
        
        update_field = {
            "services": response["data"]["services"] 
        }
        print("Update field", update_field)
        response = json.loads(dowellconnection(*User_Services,"update",field, update_field))
        

        print("OK")

        return Response(response)


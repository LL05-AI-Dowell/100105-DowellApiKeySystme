from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from .helper import *

@method_decorator(csrf_exempt, name='dispatch')
class services(APIView):
    def post(self, request):
        type_request = request.GET.get('type')

        if type_request == "add_services":
            return self.add_services(request)
        else:
            return self.handle_error(request)
        
    def get(self, request): 
        type_request = request.GET.get('type')

        if type_request == "get_service":
            return self.get_service(request)
        elif type_request == "get_all_services":
            return self.get_all_services(request)
        else:
            return self.handle_error(request)
        
    """ADD SERVICE"""   
    def add_services(self, request):
        service_id = request.data.get('service_id')
        name = request.data.get('name')
        description = request.data.get('description')
        link = request.data.get('link')
        service_type = request.data.get('service_type')
        credits = request.data.get('credits')

        field = {
            "service_id": service_id,
            "name": name,
            "description":description,
            "link": link,
            "credits": credits,
            "service_type": service_type
        }
        serializer = ApiServiceSerializer(data=field)
        if serializer.is_valid():
            if save_service(field['service_id'],field['name'],field['description'],field['link'],field['credits'],field["service_type"]):
                return Response({
                    "success": True,
                    "message": "New Service created successfully",
                    "data": field
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "success": False,
                    "message": f"Service details not saved successfully or combination of {service_id} exist",
                },status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST)

    """GET SERVICE"""    
    def get_service(self, request):
        service_id = request.GET.get('service_id')
        field = {
            "service_id":service_id
        }
        update_field = {
            "status": "Nothing to upadate"
        }
        response = get_service(field, update_field)
        if response["success"] :
            return Response(
                response, status=status.HTTP_200_OK
            )
        else:
            return Response(
                response, status=status.HTTP_404_NOT_FOUND
            )
        
    """GET ALL SERVICES"""
    def get_all_services(self, request):
        field = {
            "is_active":False
        }
        update_field = {
            "status": "Nothing to upadate"
        }
        response = get_all_services(field, update_field)
        if response["success"] :
            return Response(
                response, status=status.HTTP_200_OK
            )
        else:
            return Response(
                response, status=status.HTTP_404_NOT_FOUND
            )
        
    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
    
@method_decorator(csrf_exempt, name='dispatch')
class voucher(APIView):
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

@method_decorator(csrf_exempt, name='dispatch')
class user_api_key(APIView):
    def post(self, request):
        type_request = request.GET.get('type')

        if type_request == "create_api_key":
            return self.create_api_key(request)
        elif type_request == "activate_key":
            return self.activate_key(request)
        elif type_request == "deactivate_key":
            return self.deactivate_key(request)
        elif type_request == "activate_service":
            return self.activate_service(request)
        else:
            return self.handle_error(request)
        
    """CREATE USER API KEY"""
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
                return Response(response,status=status.HTTP_201_CREATED)
            else:
                return Response(response,status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST)
    
    """ACTIVATE USER API KEY"""
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
                return Response(response)
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
            return Response(response)
        else:
            return Response(response)
    
    """DEACTIVATE USER API KEY"""
    def deactivate_key(self, request):
        api_key = request.GET.get("api_key")
        field ={
            "api_key": api_key
        }
        update_field = {
            "is_active": False
        }
        response = deactivate_key(field,update_field)
        return Response({
            "success": True,
            "message": response["message"]
        })
    
    """ACTIVATE SERVICES BY USER"""
    def activate_service(self, request):
        api_key = request.GET.get("api_key")
        service_id = request.data.get("service_id")
        field = {
            "api_key": api_key
        }
        
        return Response(activate_deactivate_services(service_id,field))
    
    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class update_user_services(APIView):
    """UPDATE SERVICES FOR EXISTING USER , WHILE ADDING NEW SERVICE"""  
    def get(self, request):
        api_key= request.GET.get("api_key")
        field = {
            "api_key": api_key,
        }
        update_field = {
            "status": "Nothing to retrieve",
        }
        
        response = user_service_updation(field, update_field)
        if response["success"]:
            return Response(response)
        else:
            return Response(response)
        

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from .helper import *
from utils.decorator import *

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
    @protector(password= "dowellX1234uxLivingLab") 
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
        },status=status.HTTP_200_OK)

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
        elif type_request == "upgrade_credits":
            return self.upgrade_credits(request)
        else:
            return self.handle_error(request)
    def get(self, request):
        type_request = request.GET.get('type')
        if type_request == "get_api_key":
            return self.get_api_key(request)
        else:
            return self.handle_error(request)
        
    """CREATE USER API KEY"""
    def create_api_key(self, request):
        username= request.data.get('username')
        email= request.data.get('email')
        workspaceId = request.data.get('workspaceId')
        userDetails = request.data.get('userDetails')

        field= {
            "username": username,
            "email": email,
            "workspaceId": workspaceId,
            "userDetails": userDetails
        }
        APIKey = generate_uuid()
        print("API KEY ",APIKey)
        serializer = UserAPIKeySerializer(data=field)
        if serializer.is_valid():
            response = save_user_key(APIKey,field["username"],field["email"], field["workspaceId"],field["userDetails"])
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

        field = {
            "api_key": api_key
        }
        update_field = {
            "is_active": True,
            "services": get_services()
        }
        response = activate_key(field, update_field)
        if response["success"]:
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
    
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
        },status=status.HTTP_200_OK)
    
    """ACTIVATE SERVICES BY USER"""
    def activate_service(self, request):
        api_key = request.GET.get("api_key")
        service_id = request.data.get("service_id")
        field = {
            "api_key": api_key
        }
        response = activate_deactivate_services(service_id,field)
        if response["success"]:
            return Response(response,status=status.HTTP_200_OK)
        else:
            return Response(response,status=status.HTTP_400_BAD_REQUEST)
    
    """UPGRADE API KEY CREDITS"""
    def upgrade_credits(self, request):
        api_key = request.GET.get("api_key")
        total_credits = request.data.get("total_credits")
        data = {
            "total_credits": total_credits
        }
        serializer =  UpgradeSerializer(data= data)
    
        if serializer.is_valid():
            field= {
                "api_key": api_key
            }
            response = upgrade_credits_by_user(total_credits,field)
            if response["success"]:
                return Response(response,status=status.HTTP_200_OK)
            else:
                return Response(response,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            })

    """GET API KEY"""
    def get_api_key(self, request):
        workspaceId = request.GET.get("workspace_id", None)
        api_key = request.GET.get("api_key", None)
        
        if not workspaceId == None:
            field= {
                "workspaceId": workspaceId
            }
        else:
            field= {
                "api_key": api_key
            }
        update_field= {
            "status": "Nothing to update"
        }
        response = get_user_api_key(field,update_field)    
        return Response(response, status=status.HTTP_200_OK)
    
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
            return Response(response,status=status.HTTP_200_OK)
        else:
            return Response(response, status= status.HTTP_400_BAD_REQUEST)
        
@method_decorator(csrf_exempt, name='dispatch')
class process_services(APIView):
    def post(self, request):
        type_request = request.GET.get('type')

        if type_request == "api_service":
            return self.api_service(request)
        
        elif type_request == "module_service":
            return self.module_service(request)
        
        elif type_request == "product_service":
            return self.product_service(request)
        else:
            return self.handle_error(request)
        
    """PROCESS SERVICE"""
    def api_service(self, request):
        api_key = request.GET.get("api_key")
        service_id = request.data.get("service_id")
        field= {
            "api_key": api_key
        }
        update_field= {
            "status": "Nothing to update"
        }
        response = process_api_service_by_user(service_id,field,update_field)
        if response["success"]:
            return Response(response,status=status.HTTP_200_OK)
        else:
            return Response(response,status=status.HTTP_400_BAD_REQUEST)
    
    """MODULE SERVICE"""
    def module_service(self, request):
        api_key = request.GET.get("api_key")
        service_ids = request.data.get("service_ids")
        module_id = request.data.get("module_id")
        data = {
            "service_ids": service_ids,
            "module_id": module_id
        }
        serializer = ModuleSerializer(data=data)
        if serializer.is_valid():
            field= {
                "api_key": api_key
            }
            update_field= {
                "status": "Nothing to update"
            }
            response = process_module_service_by_user(service_ids,module_id,field,update_field)
            if response["success"]:
                return Response(response,status=status.HTTP_200_OK)
            else:
                return Response(response,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            })
    
    """PRODUCT SERVICE"""
    def product_service(self, request):
        api_key = request.GET.get("api_key")
        service_ids = request.data.get("service_ids")
        product_id = request.data.get("product_id")

        data = {
            "service_ids": service_ids,
            "product_id": product_id
        }
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            field= {
                "api_key": api_key
            }
            update_field= {
                "status": "Nothing to update"
            }
            response = process_module_service_by_user(service_ids,product_id,field,update_field)
            if response["success"]:
                return Response(response,status=status.HTTP_200_OK)
            else:
                return Response(response,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            })
    
    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
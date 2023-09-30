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
        elif type_request == "get_all_product_services":
            return self.get_all_product_services(request)
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
        credits = request.data.get('credits' , None)
        sub_service = request.data.get('sub_service', None)

        field = {
            "service_id": service_id,
            "name": name,
            "description":description,
            "link": link,
            "credits": credits,
            "service_type": service_type,
            "sub_service": sub_service
        }
        serializer = ApiServiceSerializer(data=field)
        if serializer.is_valid():
            if save_service(field['service_id'],field['name'],field['description'],field['link'],field['credits'],field["service_type"], field["sub_service"]):
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

    """GET ALL PRODUCT SERVICES"""
    def get_all_product_services(self, request):
        response = json.loads(dowellconnection(*Services,"fetch",field=[],update_field=None))

        data = response.get("data", {})

        product_services = []

        for product in data:
            if product["service_type"] == "PRODUCT":
                sub_services_list = []

                for sub_service in product.get("sub_service", []):
                    sub_service_name = sub_service["sub_service_name"]
                    sub_service_credits = sub_service.get("sub_service_credits", 0)

                 
                    sub_services_list.append({
                        "name": sub_service_name,
                        "credits": sub_service_credits
                    })

                data_workflow = {
                    "Product name": product["name"],
                    "Product credits": sum(sub_service["credits"] for sub_service in sub_services_list),
                    "Subproduct names": sub_services_list  
                }
                product_services.append(data_workflow)

        response_data = {
            "success": True,
            "message": "The list of product services",
            "details": product_services
        }

        return Response(response_data, status=status.HTTP_200_OK)

    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
    
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
        elif type_request == "get_user_service_key_details":
            return self.get_user_service_key_details(request)
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
    
    """GET USER SERVICE KEY DETAILS"""
    def get_user_service_key_details(self, request):
        workspace_id = request.GET.get('workspace_id')
        required_service = request.GET.get('service')
        service_type = request.GET.get('service_type')
        response = user_services_key_details(workspace_id,required_service,service_type)
        if response["success"]:
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
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
        sub_service_ids = request.data.get("sub_service_ids")
        service_id = request.data.get("service_id")
        data = {
            "sub_service_ids": sub_service_ids,
            "service_id": service_id
        }
        serializer = ModuleSerializer(data=data)
        if serializer.is_valid():
            field= {
                "api_key": api_key
            }
            update_field= {
                "status": "Nothing to update"
            }
            response = process_module_service_by_user(data["service_id"],data["sub_service_ids"],field,update_field)
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
        service_id = request.data.get("service_id")
        sub_service_ids = request.data.get("sub_service_ids")

        data = {
            "service_id": service_id,
            "sub_service_ids": sub_service_ids
        }
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            field= {
                "api_key": api_key
            }
            update_field= {
                "status": "Nothing to update"
            }
            response = process_product_service_by_user(data["service_id"],data["sub_service_ids"],field,update_field)
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
    

@method_decorator(csrf_exempt, name='dispatch')
class platform_admin_duties(APIView):
    def post(self, request):
        type_request = request.GET.get('type')

        if type_request == "restrict_workspace_key":
            return self.restrict_workspace_key(request)
        elif type_request == "update_services":
            return self.update_services(request)
        else:
            return self.handle_error(request)
        
    def get(self, request):
        type_request = request.GET.get('type')
        if type_request == "get_all_workspaces":
            return self.get_all_workspaces(request)
        else:
            return self.handle_error(request)
        
    """ACTIVATE OR DEACTIVATE WORKSPACE/USER SERVICE/API KEY"""
    def restrict_workspace_key(self, request):
        workspaceId = request.GET.get("workspace_id")
        field = {
            "workspaceId": workspaceId
        }
        serializer =  RestrictWorkspaceIdSerializer(data= field)
    
        if serializer.is_valid():
            response = restrict_workspace(field)
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

    """GET ALL WORKSPACES DETAILS"""
    def get_all_workspaces(self, request):
        field= {
            "is_active": True
        }
        response = get_all_workspaces_details(field)
        if response["success"]:
            return Response(response,status=status.HTTP_200_OK)
        else:
            return Response(response,status=status.HTTP_400_BAD_REQUEST)

    """UPDATE SERVICE"""
    def update_services(self, request):
        action = request.GET.get("action")
        document_id = request.GET.get("document_id")
        field = {
            "action": action,
            "document_id": document_id
        }
        serializer = UpdateServicesSerializer(data=field)
        if serializer.is_valid():
            field = {
                "_id": document_id,
            }
            update_field = request.data.get("update_field")
            
            response = update_service(field,update_field)
            if response["success"]:
                return Response(response,status=status.HTTP_200_OK)
            else:
                return Response(response,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST) 

    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
        
@method_decorator(csrf_exempt, name='dispatch')
class voucher(APIView):
    def post(self, request):
        type_request = request.GET.get('type')

        if type_request == 'claim_voucher':
            return self.claim_voucher(request)
        elif type_request == 'redeem_voucher':
            return self.redeem_voucher(request)
        elif type_request == 'verify_voucher_redemption':
            return self.verify_voucher_redemption(request)
        else:
            return self.handle_error(request)
    def get(self, request):
        type_request = request.GET.get('type')

        if type_request == 'verification_voucher':
            return self.verification_voucher(request)
        if type_request == 'workspace_voucher':
            return self.workspace_voucher(request)
        else:
            return self.handle_error(request)
        
    """CLAIM VOUCHER"""
    def claim_voucher(self, request):
        email = request.data.get('email')
        claim_method = request.data.get('claim_method')
        description = request.data.get('description')
        timezone = request.data.get('timezone')

        field = {
            "email": email,
            "claim_method": claim_method,
            "description": description,
            "timezone":timezone
        }
        serializer = ClaimMethodSerializer(data=field)
        if serializer.is_valid():
            response = claim_coupon(field["claim_method"], field["description"],field["timezone"],field['email'])
            if response["success"]:
                return Response(response,status=status.HTTP_200_OK)
            else:
                return Response(response,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST) 
    
    """REDEEM VOCUHER"""
    def redeem_voucher(self,request):
        workspace_id = request.GET.get('workspace_id')
        voucher_code = request.data.get('voucher_code')
        timezone = request.data.get('timezone')

        field ={
            "workspace_id" : workspace_id,
            "voucher_code":voucher_code,
            "timezone":timezone
        }
        serializer = RedeemMethodSerializer(data=field)
        if serializer.is_valid():
            response = redeem_coupon(field["workspace_id"],field["voucher_code"],field["timezone"])
            if response["success"]:
                return Response(response,status=status.HTTP_200_OK)
            else:
                return Response(response,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST) 

    """VERIFY VOUCHER REDEMPTION"""
    def verify_voucher_redemption(self,request):
        voucher_id = request.GET.get('voucher_id')
        response = verify_redemption(voucher_id)
        if response["success"]:
            return Response(response,status=status.HTTP_200_OK)
        else:
            return Response(response,status=status.HTTP_400_BAD_REQUEST)

    """GET VERIFICATION VOUCHERS"""
    def verification_voucher(self, request):
        action = request.GET.get('action')
        if action == 'verified':
            field = {
                "is_verified": True
            }
        elif action == 'unverified':
            field = {
                "is_verified": False
            }
        elif action == 'not_redeemed':
            field = {
                "is_redeemed": False
            }
        elif action == 'redeemed':
            field = {
                "is_redeemed": True
            }
        else:
            return self.handle_error(request)
        
        response = coupon_details(action,field)
        if response["success"]:
            return Response(response,status=status.HTTP_200_OK)
        else:
            return Response(response,status=status.HTTP_400_BAD_REQUEST)
        
    """GET VERIFICATION VOUCHERS"""
    def workspace_voucher(self, request):
        workspaceId = request.GET.get('workspace_id')
        action = request.GET.get('action')
        if action == 'verified':
            field = {
                "workspaceId": workspaceId,
                "is_verified": True
            }
        elif action == 'unverified':
            field = {
                "workspaceId": workspaceId,
                "is_verified": False
            }
        elif action == 'not_redeemed':
            field = {
                "workspaceId": workspaceId,
                "is_redeemed": False
            }
        elif action == 'redeemed':
            field = {
                "workspaceId": workspaceId,
                "is_redeemed": True
            }
        elif action == 'all':
            field = {
                "workspaceId": workspaceId
            }
        else:
            return self.handle_error(request)
        
        response = workspace_voucher_details(action,field)
        if response["success"]:
            return Response(response,status=status.HTTP_200_OK)
        else:
            return Response(response,status=status.HTTP_400_BAD_REQUEST)
    

    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class public_voucher_system(APIView):
    def post(self, request):
        type_request = request.GET.get('type')

        if type_request == 'generate_public_voucher':
            return self.generate_public_voucher(request)
        elif type_request == 'topup_public_voucher':
            return self.topup_public_voucher(request)
        else:
            return self.handle_error(request)
        
    def generate_public_voucher(self,request):
        timezone = request.data.get('timezone')
        description = request.data.get('description')
        credit = request.data.get('credit')

        field = {
            "description":description,
            "timezone":timezone,
            "credit":credit
        }
        serializer = PublicVoucherSerializer(data=field)
        if serializer.is_valid():
            response = generate_voucher(field["description"],field["timezone"],field["credit"])
            if response["success"]:
                return Response(response,status=status.HTTP_200_OK)
            else:
                return Response(response,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST) 
        
    def topup_public_voucher(self, request):
        voucher_code = request.data.get('voucher_code')
        workspaceId = request.data.get('workspace_id')

        field = {
            "voucher_code" : voucher_code,
            "workspace_id" : workspaceId

        }
        serializer = PublicTopupSerializer(data=field)
        if serializer.is_valid():
            response = topup_coupon(field["voucher_code"],field["workspace_id"])
            if response["success"]:
                return Response(response,status=status.HTTP_200_OK)
            else:
                return Response(response,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST) 
        
@method_decorator(csrf_exempt, name="dispatch")
class deavtivate_service_all_key(APIView):
    def get(self, request):
        field = {
            "is_active": True
        }
        response = json.loads(dowellconnection(*User_Services , "fetch", field, update_field= None))
        count = 0
        for data in response["data"]:
            if data["is_active"]:
                update_field = {
                    "is_active": False
                }
                count += 1
                response = json.loads(dowellconnection(*User_Services ,"update",field, update_field= update_field))
                
        print("service key deactivated",count)

        return Response(response)
    
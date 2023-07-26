from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from utils.constant import *
from utils.helper import *
from .serializers import *
from .helper import *

"""ADD SERVICES"""
@method_decorator(csrf_exempt, name='dispatch')
class services(APIView):
    def post(self, request):
        type_request = request.GET.get('type')

        if type_request == "add_api_service":
            return self.add_api_service(request)
        elif type_request == 'add_module_service':
            return self.add_module_service(request)
        elif type_request == 'add_product_service':
            return self.add_product_service(request)
        else:
            return self.handle_error(request)
    
    def get(self, request):
        type_request = request.GET.get('type')
        service_id = request.GET.get('service_id', None)

        if type_request == "get_all_api_service":
            return self.get_all_api_service(request)
        elif type_request == 'get_api_service':
            return self.get_api_service(request,service_id)
        
        elif type_request == 'get_all_module_service':
            return self.get_all_module_service(request)
        elif type_request == 'get_module_service':
            return self.get_module_service(request,service_id)
        
        elif type_request == 'get_all_product_service':
            return self.get_all_product_service(request)
        elif type_request == 'get_product_service':
            return self.get_product_service(request,service_id)
        
        else:
            return self.handle_error(request)
        
    """ADD API SERVICE"""
    def add_api_service(self,request):
        ids = request.data.get('ids')
        name = request.data.get('name')
        description = request.data.get('description')
        link = request.data.get('link')
        credits = request.data.get('credits')
        field = {
            "ids": ids,
            "name": name,
            "description":description,
            "link": link,
            "credits": credits
        }
        serializer = ApiServiceSerializer(data=field)
        if serializer.is_valid():
            if save_apiservice(field['ids'],field['name'],field['description'],field['link'],field['credits']):
                return Response({
                    "success": True,
                    "message": "New API Service created successfully",
                    "data": field
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "success": False,
                    "message": f"API service details not saved successfully or combination of {ids} exist",
                },status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST)
        
    """ADD MODULE SERVICE"""
    def add_module_service(self,request):
        ids = request.data.get('ids')
        name = request.data.get('name')
        module_type = request.data.get('module_type')
        description = request.data.get('description')
        link = request.data.get('link')
        credits = request.data.get('credits')
        api_service_ids = request.data.get('api_service_ids')
        field = {
            "ids": ids,
            "name": name,
            "description":description,
            "link": link,
            "credits": credits,
            "api_service_ids": api_service_ids,
            "module_type": module_type,
        }
        serializer = ModuleServiceSerializer(data=field)
        if serializer.is_valid():
            if save_moduleservice(field['ids'],field['name'],field['description'],field['link'],field['credits'],field['api_service_ids'],field['module_type']):
                return Response({
                    "success": True,
                    "message": "New Product Service created successfully",
                    "data": field
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "success": False,
                    "message": f"API service details not saved successfully or {ids} exist",
                },status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST) 
    
    """ADD PRODUCT SERVICE"""
    def add_product_service(self,request):
        ids = request.data.get('ids')
        name = request.data.get('name')
        description = request.data.get('description')
        link = request.data.get('link')
        credits = request.data.get('credits')
        service_ids = request.data.get('service_ids')
        field = {
            "ids": ids,
            "name": name,
            "description":description,
            "link": link,
            "credits": credits,
            "service_ids": service_ids,
        }
        serializer = ProductServiceSerializer(data=field)
        if serializer.is_valid():
            if save_productservice(field['ids'],field['name'],field['description'],field['link'],field['credits'],field['service_ids']):
                return Response({
                    "success": True,
                    "message": "New Product Service created successfully",
                    "data": field
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "success": False,
                    "message": f"API service details not saved successfully or {ids} exist",
                },status=status.HTTP_400_BAD_REQUEST)
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
    
    """GET ALL API SERVICES"""
    def get_all_api_service(self, request):
        field = {
            "is_active": False
        }
        update_field = {
            "status":"Nothing to update"
        }
        return Response({
            "success": True,
            "message": "List of API Services",
            "data": get_api_service(field, update_field)
        },status=status.HTTP_200_OK)
    
    """GET API SERVICES"""
    def get_api_service(self, request,service_id):
        field = {
            "ids": service_id
        }
        update_field = {
            "status":"Nothing to update"
        }
        return Response({
            "success": True,
            "message": "List of API Services",
            "data": get_api_service(field, update_field)
        },status=status.HTTP_200_OK)
    
    """GET ALL MODULE SERVICES"""
    def get_all_module_service(self, request):
        field = {
            "is_active": False
        }
        update_field = {
            "status":"Nothing to update"
        }
        return Response({
            "success": True,
            "message": "List of API Services",
            "data": get_module_service(field, update_field)
        },status=status.HTTP_200_OK)
    
    """GET MODULE SERVICES"""
    def get_module_service(self, request,service_id):
        field = {
            "ids": service_id
        }
        update_field = {
            "status":"Nothing to update"
        }
        return Response({
            "success": True,
            "message": "List of API Services",
            "data": get_module_service(field, update_field)
        },status=status.HTTP_200_OK)
    
    """GET ALL PRODUCT SERVICES"""
    def get_all_product_service(self, request):
        field = {
            "is_active": False
        }
        update_field = {
            "status":"Nothing to update"
        }
        return Response({
            "success": True,
            "message": "List of API Services",
            "data": get_product_service(field, update_field)
        },status=status.HTTP_200_OK)
    
    """GET PRODUCT SERVICES"""
    def get_product_service(self, request,service_id):
        field = {
            "ids": service_id
        }
        update_field = {
            "status":"Nothing to update"
        }
        return Response({
            "success": True,
            "message": "List of API Services",
            "data": get_product_service(field, update_field)
        },status=status.HTTP_200_OK)
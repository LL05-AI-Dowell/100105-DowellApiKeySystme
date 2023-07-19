from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from .models import *

"""
@name : Server status check
@description : To check the server status
"""
@method_decorator(csrf_exempt, name='dispatch')
class server_check(APIView):
    def get(self, request ):
        return Response({
            "If you are seeing this , then the DOWELL API KEY SYSTEM V2 is !down"
        },status=status.HTTP_200_OK)

"""
@name : Add API services
@description : To add api sevices document
"""   
@method_decorator(csrf_exempt, name='dispatch')
class add_api_services(APIView):
    def post(self, request):
        api_service_id = request.data.get('api_service_id')
        name_service = request.data.get('name_service')
        document_link = request.data.get('document_link')
        credits_count = request.data.get('credits_count')

        field = {
            "api_service_id": api_service_id,
            "name_service": name_service,
            "document_link": document_link,
            "credits_count": credits_count
        }

        serializer = APIServiceSerializer(data=field)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "API service details saved successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success": False,
                "message": "API service details not saved successfully",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        api_services = APISERVICES.objects.all()
        serializer = APIServiceSerializer(api_services, many=True)

        return Response({
            "success": True,
            "message": "List of Services",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

"""
@name : Add Module
@description : To add api module document
"""   
@method_decorator(csrf_exempt, name='dispatch')
class add_module(APIView):
    def post(self, request):
        module_type = request.data.get('module_type')
        module_id = request.data.get('module_id')
        name_module = request.data.get('name_module')
        document_link = request.data.get('document_link')
        credits_count = request.data.get('credits_count')
        api_service_ids = request.data.get('api_service_ids')

        field = {
            "module_type": module_type,
            "module_id": module_id,
            "name_module": name_module,
            "document_link": document_link,
            "credits_count": credits_count,
            "api_service_ids": api_service_ids
        }

        serializer = ModuleSerializer(data=field)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Module details saved successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success": False,
                "message": "Module details not saved successfully",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request):
        module = MODULE.objects.all()
        serializer = ModuleSerializer(module, many=True)

        return Response({
            "success": True,
            "message": "List of Module",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    

"""
@name : Add Product
@description : To add Product
"""   
@method_decorator(csrf_exempt, name='dispatch')
class add_product(APIView):
    def post(self, request):
        product_id = request.data.get('product_id')
        product_name = request.data.get('product_name')
        product_link = request.data.get('product_link')
        credits_count = request.data.get('credits_count')
        types = request.data.get('types')

        field = {
            "product_id": product_id,
            "product_name": product_name,
            "product_link": product_link,
            "credits_count": credits_count,
            "types": types
        }

        serializer = ProductSerializer(data=field)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Product details saved successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success": False,
                "message": "Product details not saved successfully",
                "error": serializer.errors
            },status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request):
        product = PRODUCT.objects.all()
        serializer = ProductSerializer(product, many=True)

        return Response({
            "success": True,
            "message": "List of Product",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

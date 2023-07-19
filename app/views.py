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
from .models import ApiKey,Document,Component,Library,Flutterflow_component
from .serializers import *
from django.core.serializers import serialize
from django.forms.models import model_to_dict



"""
@Add API services
@description: To add a new API service
"""
@method_decorator(csrf_exempt, name='dispatch')
class DocumentDetails(APIView):

    def post(self, request):
        api_service_id = request.data.get('api_service_id')
        api_service = request.data.get('api_service')
        document_link = request.data.get('document_link')
        credits_count = request.data.get('credits_count')
        name = request.data.get('name')
        
        field = {
            "api_service_id": api_service_id,
            "api_service": api_service,
            "document_link": document_link,
            "credits_count": credits_count,
            "name":name
        }
        
        serializer = DocumentSerializer(data=field)
        if serializer.is_valid():
            document = serializer.save()
            
            existing_users = ApiKey.objects.all()
            document_dict = model_to_dict(document)

            for user in existing_users:
                user.api_services.append(document_dict)
                user.save()
            
            return Response({
                "success": True,
                "message": "API service details saved successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):
        documents = Document.objects.all()
        serializer = DocumentSerializer(documents, many=True)

        return Response({
            "success": True,
            "message": "List of Services",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    
    def put(self, request):
        api_service_id = request.data.get('api_service_id')
        update_fields = request.data.get('fields')

        try:
            document = Document.objects.get(api_service_id=api_service_id)

            for field, value in update_fields.items():
                setattr(document, field, value)

            document.save()

            existing_users = ApiKey.objects.all()
            for user in existing_users:
                user_api_service = user.api_services
                for api_service in user_api_service:
                    if api_service.get('api_service_id') == api_service_id:
                        for field, value in update_fields.items():
                            api_service[field] = value
                    user.save()

            return Response({
                "success": True,
                "message": "The fields have been updated",
            }, status=status.HTTP_200_OK)

        except Document.DoesNotExist:
            return Response({
                "success": False,
                "message": "The api service_id does not exist",
            }, status=status.HTTP_404_NOT_FOUND)

"""
@Generate Vocucher :
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
@Redeem voucher
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
                 

    def get(self, request, userid):
        try:
            redeemVouchers = RedeemVoucher.objects.filter(userId=userid)
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

        documents = Document.objects.all()
        document_list = []
        components = Component.objects.all()
        component_list = []
        libraries = Library.objects.all()
        library_list = []
        Flutterflow_components = Flutterflow_component.objects.all()
        flutter_component_list = []


        for document in documents:
            document_dict = {
                'api_service_id': document.api_service_id,
                'api_service': document.api_service,
                'document_link': document.document_link,
                'is_active': document.is_active,
                'is_released': document.is_released,
                'credits_count': document.credits_count,
            }
            document_list.append(document_dict)

        for component in components:
            component_dict = {
                'component_id': component.Component_id,
                'name': component.name,
                'component_link':component.component_link,
                'is_active': component.is_active,
                'is_released': component.is_released,
                'credits_count': component.credits_count,
            }
            component_list.append(component_dict)
        
        for library in libraries:
            library_dict = {
                'libraryid': library.libraryid,
                'name': library.name,
                'library_link':library.library_link,
                'is_active': library.is_active,
                'is_released': library.is_released,
                'credits_count': library.credits_count,
                
            }
            library_list.append(library_dict)

        for flutterflow in Flutterflow_components:
            flutter_dict = {
                'component_id': flutterflow.Flutterflow_component_id,
                'name': flutterflow.name,
                'credits_count': flutterflow.credits_count,
                'is_active': flutterflow.is_active,
                'is_released': flutterflow.is_released,
            }
            flutter_component_list.append(flutter_dict)

        APIKey = generate_uuid()
       

        field = {
            "username": username,
            "email": email,
            "userId":userid,
            "APIKey": APIKey,
            "userDetails": userDetails,
            "api_services":document_list,
            "Component":component_list,
            "flutterflow":flutter_component_list,
            # "Product":product_list,
            "Library":library_list
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
            api_key = ApiKey.objects.filter(userId=userid)
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
        
    def put(self, request,userid):
        APIKey = request.data.get('api_key')
        voucher_code = request.data.get('voucher_code', None)

        try:
            api_key = ApiKey.objects.get(userId=userid, APIKey=APIKey)
        except ApiKey.DoesNotExist:
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
        
"""
@Activate the API services
@description :  To activate and deactivate the API services
"""
@method_decorator(csrf_exempt, name='dispatch')
class ActivateService(APIView):
    def get(self, request, userid, apikey, api_service_id):
        try:
            api_key = ApiKey.objects.get(userId=userid, APIKey=apikey)
        except ApiKey.DoesNotExist:
            return Response({
                "success": False,
                "message": "API details not found."
            }, status=status.HTTP_404_NOT_FOUND)

        if not api_key.is_active:
            return Response({
                "success": False,
                "message": "First you need activate the API key."
            }, status=status.HTTP_401_UNAUTHORIZED)

        credits = api_key.credits

        if credits <= 0:
            return Response({
                "success": False,
                "message": "You don't have enough credit to activate the API Key."
            }, status=status.HTTP_401_UNAUTHORIZED)

        api_services = api_key.api_services

        action = "activated"
        for service in api_services:
            if service['api_service_id'] == api_service_id:
                service['is_active'] = not service['is_active']
                action = "activated" if service['is_active'] else "deactivated"
                api_key.save()

        

        return Response({
            "success": True,
            "message": f"Associated service {action} successfully."
        }, status=status.HTTP_200_OK)

"""
@Process API Key
@description: To process the API key by product people
"""   
@method_decorator(csrf_exempt, name='dispatch')
class processAPIKey(APIView):
    def post(self, request):
        user_api_key = request.data.get("api_key")
        api_service_id = request.data.get("api_service_id")
        field = {
            "user_api_key": user_api_key,
            "api_service_id": api_service_id
        }
        serializer = ProcessAPIKeySerializer(data=field)
        if serializer.is_valid():
            try:
                api_key = ApiKey.objects.get(APIKey=user_api_key)
                print("---Got api key---", api_key)
            except ApiKey.DoesNotExist:
                return Response({
                    "success": False,
                    "message": "API key does not exist or the combination is invalid"
                }, status=status.HTTP_404_NOT_FOUND)

            if api_key.is_active:
                api_service = api_key.api_services
                service_found = False

                for service in api_service:
                    if service['api_service_id'] == api_service_id:
                        service_found = True

                        if service['is_active']:
                            if api_key.credits > 0:
                                api_services = api_key.api_services

                                for service in api_services:
                                    if service['api_service_id'] == api_service_id:
                                        api_key.credits -= service['credits_count']
                                        api_key.save()
                                        serializer = ApiKeySerializer(api_key)
                                        return Response({
                                            "success": True,
                                            "message": "The count is decremented",
                                            "count": serializer.data["credits"]
                                        }, status=status.HTTP_200_OK)
                            else:
                                return Response({
                                    "success": False,
                                    "message": "Limit exceeded",
                                }, status=status.HTTP_401_UNAUTHORIZED)
                        else:
                            return Response({
                                "success": False,
                                "message": "API service is not active"
                            }, status=status.HTTP_403_FORBIDDEN)

                if not service_found:
                    return Response({
                        "success": False,
                        "message": "API service ID is invalid"
                    }, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({
                    "success": False,
                    "message": "API key is inactive"
                }, status=status.HTTP_403_FORBIDDEN)
        else:
            default_errors = serializer.errors
            new_error = {}
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
            return Response(new_error, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class Apikey_Upgrade(APIView):
    def put(self, request):
        api=request.data.get('api_key')
        bought_credits=100
        try:
            api_key=ApiKey.objects.get(APIKey=api)
            print(api_key)
            if api_key.is_active==True:
                api_key.credits += bought_credits
                api_key.total_credits=api_key.credits
                api_key.save()
                return Response({
                    "Success":True,
                    "Message":"Successfully updated the total credits to 100"
                },status=status.HTTP_200_OK)
            else:
                return Response({
                "Success":False,
                "Message":"Your Api key is not activated yet, Please activaet it First"
            })

        except ApiKey.DoesNotExist:
            return Response({
                "Success":False,
                "Message":"No api key Found"
            },status=status.HTTP_404_NOT_FOUND)
    
import json
@method_decorator(csrf_exempt, name='dispatch')
class Componentview(APIView): 
    def post(self, request):
        component_name=request.data.get('name')
        component_id=request.data.get('id')
        component_link=request.data.get('link')
        api_service_id=request.data.get('apiservice_ids')
        api_services = []
        api_services_credit_count = 0
        for id in api_service_id:
            try:
                api_service = Document.objects.get(api_service_id=id)
                api_services.append({
                    "api_name":api_service.api_service,
                    'api_service_id':api_service.api_service_id,
                    "credit_count":api_service.credits_count,
                    "is_active":api_service.is_active,
                    "is_released":api_service.is_released
                })
                api_services_credit_count += api_service.credits_count
                api_service.save()
            except Document.DoesNotExist:
                return Response({'error': 'API service not found.'}, status=400)
        api_services_json = json.dumps(api_services)
        print(api_services_json)
        field = {
        "name": component_name,
        "Component_id":component_id,
        "component_link":component_link,
        "credits_count":api_services_credit_count,
        "api_service":api_services
        }
        serializer=componentSerializer(data=field)
        print(serializer)
        if serializer.is_valid():
            components = serializer.save()
            
            existing_users = ApiKey.objects.all()
            component_dict = model_to_dict(components)

            for user in existing_users:
                user.Component.append(component_dict)
                user.save()
            return Response({
                "Success":True,
                "Message":"Component Created Successfully"
            },status=status.HTTP_200_OK)
        else:
            print('not valid')
            return Response(serializer.errors, status=400)
        
    def put(self, request):
        component_id = request.data.get('component_id')
        update_fields = request.data.get('fields')

        try:
            component = Component.objects.get(Component_id=component_id)

            for field, value in update_fields.items():
                setattr(component, field, value)

            component.save()

            existing_users = ApiKey.objects.all()
            for user in existing_users:
                user_api_services = user.Component
                for api_service in user_api_services:
                    if api_service.get('component_id') == component_id:
                        for field, value in update_fields.items():
                            api_service[field] = value
                user.save()

            return Response({
                "success": True,
                "message": "The fields have been updated",
            }, status=status.HTTP_200_OK)

        except Component.DoesNotExist:
            return Response({
                "success": False,
                "message": "The component_id does not exist",
            }, status=status.HTTP_404_NOT_FOUND)


    def get(self, request):
        components = Component.objects.all()
        serializer = componentSerializer(components, many=True)
        return Response(serializer.data, status=200)
"""
@activate component
@description: to activate component through apikey and component id
"""  
@method_decorator(csrf_exempt, name='dispatch')
class activate_Component(APIView):
    def get(self, request):
        api_key=request.data.get("api_key")
        component_id=request.data.get("component_id")
        try:
            api_key = ApiKey.objects.get(APIKey=api_key)
        except ApiKey.DoesNotExist:
            return Response({
                "success": False,
                "message": "API details not found."
            }, status=status.HTTP_404_NOT_FOUND)
        if not api_key.is_active:
            return Response({
                "success": False,
                "message": "First you need activate the API key."
            }, status=status.HTTP_401_UNAUTHORIZED)
        credits = api_key.credits
        if credits <= 0:
            return Response({
                "success": False,
                "message": "You don't have enough credit to activate the API Key."
            }, status=status.HTTP_401_UNAUTHORIZED)

        components = api_key.Component

        action = "activated"
        for service in components:
            if service['component_id'] == component_id:
                service['is_active'] = not service['is_active']
                action = "activated" if service['is_active'] else "deactivated"
                api_key.save()
        return Response({
            "success": True,
            "message": f"Associated service {action} successfully."
        }, status=status.HTTP_200_OK)
"""
@activate component
@description: to activate component through apikey and component id
"""  
@method_decorator(csrf_exempt, name='dispatch')
class libraryview(APIView): 
    def post(self, request):
        library_name=request.data.get('name')
        library_id=request.data.get('library_id')
        library_link=request.data.get('link')
        api_service_id=request.data.get('apiservice_ids')
        api_services = []
        api_services_credit_count = 0
        for id in api_service_id:
            try:
                api_service = Document.objects.get(api_service_id=id)
                api_services.append({
                    "api_name":api_service.api_service,
                    'api_service_id':api_service.api_service_id,
                    "credit_count":api_service.credits_count,
                    "is_active":api_service.is_active,
                    "is_released":api_service.is_released
                })
                api_services_credit_count += api_service.credits_count
                api_service.save()            
            except Document.DoesNotExist:
                return Response({'error': 'API service not found.'}, status=400)
        field = {
        "name": library_name,
        "libraryid":library_id,
        "library_link":library_link,
        "credits_count":api_services_credit_count,
        "api_service":api_services
        }   
        serializer=librarySerializer(data=field)
        if serializer.is_valid():   
            libraries=serializer.save()
            existing_users = ApiKey.objects.all()
            library_dict = model_to_dict(libraries)

            for user in existing_users:
                user.Library.append(library_dict)
                user.save()
            return Response({
                "Success":True,
                "Message":"Library Created Successfully"
            },status=status.HTTP_200_OK)
        
        else:
            print('not valid')
            return Response(serializer.errors, status=400)    
    def put(self, request):
        Library_id = request.data.get('library_id')
        update_fields = request.data.get('fields')

        try:
            library = Library.objects.get(libraryid=Library_id)

            for field, value in update_fields.items():
                setattr(library, field, value)

            library.save()

            existing_users = ApiKey.objects.all()
            for user in existing_users:
                library_services = user.Library
                for service in library_services:
                    if service.get('libraryid') == Library_id:
                        print('here')
                        for field, value in update_fields.items():
                            service[field] = value
                user.save()

            return Response({
                "success": True,
                "message": "The fields have been updated",
            }, status=status.HTTP_200_OK)

        except Component.DoesNotExist:
            return Response({
                "success": False,
                "message": "The library id does not exist",
            }, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        Librarydata = Library.objects.all()
        serializer = librarySerializer(Librarydata, many=True)
        return Response(serializer.data, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class activate_library(APIView):
    def get(self, request):
        api_key=request.data.get("api_key")
        library_id=request.data.get("library_id")
        try:
            api = ApiKey.objects.get(APIKey=api_key)
        except ApiKey.DoesNotExist:
            return Response({
                "success": False,
                "message": "API details not found."
            }, status=status.HTTP_404_NOT_FOUND)

        if not api.is_active:
            return Response({
                "success": False,
                "message": "First you need activate the API key."
            }, status=status.HTTP_401_UNAUTHORIZED)

        credits = api.credits

        if credits <= 0:
            return Response({
                "success": False,
                "message": "You don't have enough credit to activate the API Key."
            }, status=status.HTTP_401_UNAUTHORIZED)

        libraries = api.Library
        print(libraries)
        action = "activated"
        for service in libraries:
            if service['library_id'] == library_id:
                service['is_active'] = not service['is_active']
                action = "activated" if service['is_active'] else "deactivated"
            api.save()
        return Response({
            "success": True,
            "message": f"Associated service {action} successfully."
        }, status=status.HTTP_200_OK)

class Flutterflowview(APIView):
    def post(self, request):
        flutter_flow_component_name=request.data.get('name')
        flutter_flow_component_id=request.data.get('id')
        flutter_flow_component_link=request.data.get('link')
        api_service_id=request.data.get('apiservice_ids')
        api_services = []
        api_services_credit_count = 0
        for id in api_service_id:
            try:
                api_service = Document.objects.get(api_service_id=id)
                api_services.append({
                    "api_name":api_service.api_service,
                    'api_service_id':api_service.api_service_id,
                    "credit_count":api_service.credits_count,
                    "is_active":api_service.is_active,
                    "is_released":api_service.is_released
                })
                api_services_credit_count += api_service.credits_count
                api_service.save()
            except Document.DoesNotExist:
                return Response({'error': 'API service not found.'}, status=400)    
            
        field = {
            "name": flutter_flow_component_name,
            "Flutterflow_component_id":flutter_flow_component_id,
            "flutter_flow_component_link":flutter_flow_component_link,
            "credits_count":api_services_credit_count,
            "api_service":api_services
        }   
               
        
        serializer = Flutterflow_serializer(data=field)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "Success":True,
                "Message":"Succesfully created new flutter Component"
            },status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=400) 
        
    def put(self, request):
        flutter_id = request.data.get('flutter_id')
        update_fields = request.data.get('fields')
        try:
            flutter_components = Flutterflow_component.objects.get(Flutterflow_component_id=flutter_id)
            for field, value in update_fields.items():
                setattr(flutter_components, field, value)
            flutter_components.save()
            existing_users = ApiKey.objects.all()
            for user in existing_users:
                flutter_components = user.flutterflow
                for service in flutter_components:
                    if service.get('component_id') == flutter_id:
                        print('here')
                        for field, value in update_fields.items():
                            service[field] = value
                        user.save()
                        return Response({
                            "success": True,
                            "message": "The fields have been updated",
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response({
                            "success": False,
                            "message": "The component id does not match to existing user/ not updated",
                        }, status=status.HTTP_200_OK)
                
        except Component.DoesNotExist:
            return Response({
                "success": False,
                "message": "The library id does not exist",
            }, status=status.HTTP_404_NOT_FOUND)       
    def get(self, request):
        Flutterflowdata = Flutterflow_component.objects.all()
        serializer = Flutterflow_serializer(Flutterflowdata, many=True)
        return Response(serializer.data, status=200)
    


@method_decorator(csrf_exempt, name='dispatch')
class activate_flutter(APIView):
    def get(self, request):
        api_key=request.data.get("api_key")
        component_id=request.data.get("flutter_component_id")
        print(component_id)
        try:
            api = ApiKey.objects.get(APIKey=api_key)
        except ApiKey.DoesNotExist:
            return Response({
                "success": False,
                "message": "API details not found."
            }, status=status.HTTP_404_NOT_FOUND)

        if not api.is_active:
            return Response({
                "success": False,
                "message": "First you need activate the API key."
            }, status=status.HTTP_401_UNAUTHORIZED)

        credits = api.credits

        if credits <= 0:
            return Response({
                "success": False,
                "message": "You don't have enough credit to activate the API Key."
            }, status=status.HTTP_401_UNAUTHORIZED)

        flutter_flow_components = api.flutterflow
        print(flutter_flow_components)
        action = "activated"
        for service in flutter_flow_components:
            print(service)
            print(service)
            if service['component_id'] == component_id:
                print("here")
                service['is_active'] = not service['is_active']
                action = "activated" if service['is_active'] else "deactivated"
                api.save()
                return Response({
                    "success": True,
                    "message": f"Associated service {action} successfully."
                }, status=status.HTTP_200_OK)
            else: 
                return Response({
                    "success": False,
                    "message": f"Associated service {action} id dont match."
                }, status=status.HTTP_404_NOT_FOUND)

from django.apps import apps

@method_decorator(csrf_exempt, name='dispatch')
class Productview(APIView): 
    def post(self, request):
        product_name=request.data.get('name')
        product_id=request.data.get('product_id')
        product_link=request.data.get('link')
        service_type=request.data.get('service_type')
        service_name = apps.get_model(app_label='app', model_name=service_type)
        service_id=request.data.get('service_id')
        print(service_id)
        services = []
        api_services_credit_count = 0
        for id in service_id:
            try:
                service = service_name.objects.get(id=id)
                services.append({
                    "service_name":service.name,
                    'service_id':service.id,
                    "credit_count":service.credits_count,
                    "is_active":service.is_active,
                    "is_released":service.is_released
                })
                api_services_credit_count += service.credits_count
                service.save()  
            except service_name.DoesNotExist:
                return Response({'error': 'API service not found.'}, status=400)
        print(services)
        field = {
            "name": product_name,
            "product_id":product_id,
            "product_link":product_link,
            "credits_count":api_services_credit_count,
            "services":services
        }   
        serializer=Product_serializer(data=field)
        if serializer.is_valid():   
            serializer.save()
            return Response({
                "Success":True,
                "Message":"Product created Created Successfully"
            },status=status.HTTP_200_OK)
        
        else:
            print('not valid')
            return Response(serializer.errors, status=400)
    
        
    def get(self, request):
        product = Product.objects.all()
        serializer = Product_serializer(product, many=True)
        return Response(serializer.data, status=200)    
        
           
        
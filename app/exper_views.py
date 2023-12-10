from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from .datacubeservices import *
from .helper import *
from dotenv import load_dotenv
import os
from threading import Thread
import json


load_dotenv("/home/100105/100105-DowellApiKeySystem/.env")
api_key = str(os.getenv("API_KEY"))
DATABASE_DB0 = str(os.getenv("DATABASE_DB0"))
DATABASE_DB1 = str(os.getenv("DATABASE_DB1"))

SAMANTA_CONTENT_EVALUATOR_DB0 = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_DB0"))
WORLD_PRICE_INDICATOR_DB0 = str(os.getenv("WORLD_PRICE_INDICATOR_DB0"))
LEGALZARD_DB0 = str(os.getenv("LEGALZARD_DB0"))
LOCATION_SPECIFIC_SEARCH_DB0 = str(os.getenv("LOCATION_SPECIFIC_SEARCH_DB0"))
WEBSITE_CRAWL_DB0 = str(os.getenv("WEBSITE_CRAWL_DB0"))

SAMANTA_CONTENT_EVALUATOR_DB1 = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_DB1"))
WORLD_PRICE_INDICATOR_DB1 = str(os.getenv("WORLD_PRICE_INDICATOR_DB1"))
LEGALZARD_DB1 = str(os.getenv("LEGALZARD_DB1"))
LOCATION_SPECIFIC_SEARCH_DB1 = str(os.getenv("LOCATION_SPECIFIC_SEARCH_DB1"))
WEBSITE_CRAWL_DB1 = str(os.getenv("WEBSITE_CRAWL_DB1"))

# # UNCOMMENT WHEN RUNNING WITH LOCAL 
# load_dotenv(f"{os.getcwd()}/.env")
# api_key = str(os.getenv("API_KEY"))
# DATABASE_DB0 = str(os.getenv("DATABASE_DB0"))
# DATABASE_DB1 = str(os.getenv("DATABASE_DB1"))

# SAMANTA_CONTENT_EVALUATOR_DB0 = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_DB0"))
# WORLD_PRICE_INDICATOR_DB0 = str(os.getenv("WORLD_PRICE_INDICATOR_DB0"))
# LEGALZARD_DB0 = str(os.getenv("LEGALZARD_DB0"))
# LOCATION_SPECIFIC_SEARCH_DB0 = str(os.getenv("LOCATION_SPECIFIC_SEARCH_DB0"))
# WEBSITE_CRAWL_DB0 = str(os.getenv("WEBSITE_CRAWL_DB0"))

# SAMANTA_CONTENT_EVALUATOR_DB1 = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_DB1"))
# WORLD_PRICE_INDICATOR_DB1 = str(os.getenv("WORLD_PRICE_INDICATOR_DB1"))
# LEGALZARD_DB1 = str(os.getenv("LEGALZARD_DB1"))
# LOCATION_SPECIFIC_SEARCH_DB1 = str(os.getenv("LOCATION_SPECIFIC_SEARCH_DB1"))
# WEBSITE_CRAWL_DB1 = str(os.getenv("WEBSITE_CRAWL_DB1"))


@method_decorator(csrf_exempt, name='dispatch')
class experiences_datacube_services(APIView):
    def post(self, request):
        type_request = request.GET.get('type')
    

        if type_request == "experienced_user_details":
            return self.experienced_user_details(request)
        else:
            return self.handle_error(request)
        
    def get(self, request): 
        type_request = request.GET.get('type')

        if type_request == "healt_check":
            return self.healt_check(request)
        elif type_request == "get_user_email":
            return self.get_user_email(request)
        else:
            return self.handle_error(request)

    """Health check for services"""
    def healt_check(self, request):
        return Response({
            "success":True,
            "message":"if your are seeing this then , the experience database operation server is !down"
        },status=status.HTTP_200_OK)
    
    """Database Operation for experience product services"""
    def experienced_user_details(self, request):
        product_name = request.data.get('product_name')
        email = request.data.get('email')
        experienced_data = request.data.get('experienced_data')
        
        field = {
            "product_name": product_name,
            "email": email,
            "experienced_data": experienced_data
        }

        serializer = ExperiencedProductSerializer(data=field)

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        collection_name = get_formatted_date()

        db0_collection_mapping = {
            "SAMANTA CONTENT EVALUATOR": SAMANTA_CONTENT_EVALUATOR_DB0,
            "WORLD PRICE INDICATOR": WORLD_PRICE_INDICATOR_DB0,
            "LEGALZARD": LEGALZARD_DB0,
            "LOCATION SPECIFIC SEARCH": LOCATION_SPECIFIC_SEARCH_DB0,
            "WEBSITE CRAWL": WEBSITE_CRAWL_DB0
        }

        db0_collection_name = db0_collection_mapping.get(product_name)

        def save_metadata_masterdb():
            datacube_data_insertion(
                api_key,
                DATABASE_DB0,
                db0_collection_name,
                {
                    "email": email,
                    "product_name": product_name,
                    "experienced_date": collection_name["formatted_date"],
                    "experienced_time": collection_name["formatted_time"],
                    "records": [{"record": "1", "type": "overall"}]
                }
            )

        experienced_user_metadata = Thread(target=save_metadata_masterdb)
        experienced_user_metadata.start()

        response = json.loads(
            datacube_data_insertion(
                api_key,
                DATABASE_DB1,
                collection_name["formatted_date_ux"],
                {
                    "product_name": product_name,
                    "email": email,
                    "experienced_data": experienced_data,
                    "experienced_date": collection_name["formatted_date"],
                    "experienced_time": collection_name["formatted_time"],
                    "records": [{"record": "1", "type": "overall"}]
                }
            ))

        if not response["success"]:
            response_create_collection = json.loads(datacube_create_collection(
                api_key, 
                DATABASE_DB1, 
                collection_name["formatted_date_ux"]
            ))
            print("collection", response_create_collection)

            if not response_create_collection["success"]:
                return Response({
                    "success": False,
                    "message": "Failed to create new collection and insert data into database",
                    "database_response": {
                        "success": response_create_collection["success"],
                        "message": response_create_collection["message"],
                    },
                }, status=status.HTTP_400_BAD_REQUEST)

            response = json.loads(
                datacube_data_insertion(
                    api_key,
                    DATABASE_DB1,
                    collection_name["formatted_date_ux"],
                    {
                        "product_name": product_name,
                        "email": email,
                        "experienced_data": experienced_data,
                        "experienced_date": collection_name["formatted_date"],
                        "experienced_time": collection_name["formatted_time"],
                        "records": [{"record": "1", "type": "overall"}]
                    }
                ))

            if not response["success"]:
                return Response({
                    "success": False,
                    "message": "Failed to insert data into the database",
                    "database_response": {
                        "success": response["success"],
                        "message": response["message"],
                    },
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "Experienced user details successfully saved",
            "database_response": {
                "success": response["success"],
                "message": response["message"],
                "inserted_id": response.get("data", {}).get("inserted_id"),
            },
            "response": {
                "product_name": product_name,
                "email": email,
                "experienced_data": experienced_data,
                "experienced_date": collection_name["formatted_date"],
                "experienced_time": collection_name["formatted_time"]
            }
        }, status=status.HTTP_201_CREATED)

    """User email address from different product database"""
    def get_user_email(self, request):
        product_number = request.GET.get("product_number")
        email = request.GET.get("email")

        field = {
            "product_number": product_number,
            "email": email
        }
        serializer = ExperiencedUserDetailsSerializer(data= field)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


        db0_collection = {
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_DB0,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_DB0,
            "UXLIVINGLAB003": LEGALZARD_DB0,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_DB0,
            "UXLIVINGLAB005": WEBSITE_CRAWL_DB0
        }
        db0_collection_name = db0_collection.get(product_number)

        response = json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            db0_collection_name,
            {
                "email": email
            },
            100000,
            0,
            False
        ))

        if not response["success"]:
            return Response({
                "success": False,
                "message": "Failed to retrive data from database",
                "database_response": {
                    "success": response["success"],
                    "message": response["message"],
                },
            }, status=status.HTTP_400_BAD_REQUEST)

        data = response.get("data",[])

        occurrences = sum(entry['email'] == email for entry in data)

        return Response({
            "success": True,
            "message": "Occurrence of email address in database",
            "occurrences": occurrences
        }, status=status.HTTP_200_OK)

    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)


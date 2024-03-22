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
from utils.helper import *
from datetime import datetime, timedelta


# UNCOMMENT ON PRODUCTION
load_dotenv("/home/100105/100105-DowellApiKeySystem/.env")
api_key = str(os.getenv("API_KEY"))
DATABASE_DB0 = str(os.getenv("DATABASE_DB0"))
DATABASE_DB1 = str(os.getenv("DATABASE_DB1"))

SAMANTA_CONTENT_EVALUATOR_EXPERINECED = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_EXPERINECED"))
WORLD_PRICE_INDICATOR_EXPERINECED = str(os.getenv("WORLD_PRICE_INDICATOR_EXPERINECED"))
LEGALZARD_EXPERINECED = str(os.getenv("LEGALZARD_EXPERINECED"))
LOCATION_SPECIFIC_SEARCH_EXPERINECED = str(os.getenv("LOCATION_SPECIFIC_SEARCH_EXPERINECED"))
WEBSITE_CRAWL_EXPERINECED = str(os.getenv("WEBSITE_CRAWL_EXPERINECED"))
SEARCH_IN_LIVINGLAB_EXPERINECED = str(os.getenv("SEARCH_IN_LIVINGLAB_EXPERINECED"))
DOWELL_CONTACT_US_EXPERINECED = str(os.getenv("DOWELL_CONTACT_US_EXPERINECED"))
RANDOM_GRAPH_EXPERINECED = str(os.getenv("RANDOM_GRAPH_EXPERINECED"))
DOWELL_PERMUTATION_CALCULATOR_EXPERINECED = str(os.getenv("DOWELL_PERMUTATION_CALCULATOR_EXPERINECED"))


SAMANTA_CONTENT_EVALUATOR_USER = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_USER"))
WORLD_PRICE_INDICATOR_USER = str(os.getenv("WORLD_PRICE_INDICATOR_USER"))
LEGALZARD_USER = str(os.getenv("LEGALZARD_USER"))
LOCATION_SPECIFIC_SEARCH_USER = str(os.getenv("LOCATION_SPECIFIC_SEARCH_USER"))
WEBSITE_CRAWL_USER = str(os.getenv("WEBSITE_CRAWL_USER"))
SEARCH_IN_LIVINGLAB_USER = str(os.getenv("SEARCH_IN_LIVINGLAB_USER"))
DOWELL_CONTACT_US_USER = str(os.getenv("DOWELL_CONTACT_US_USER"))
RANDOM_GRAPH_USER = str(os.getenv("RANDOM_GRAPH_USER"))
DOWELL_PERMUTATION_CALCULATOR_USER = str(os.getenv("DOWELL_PERMUTATION_CALCULATOR_USER"))

VOUCHER_SYSTEM = str(os.getenv("VOUCHER_SYSTEM"))
CLIENT_VOUCHER_SYSTEM = str(os.getenv("CLIENT_VOUCHER_SYSTEM"))

# # UNCOMMENT WHEN RUNNING WITH LOCAL 
# load_dotenv(f"{os.getcwd()}/.env")
# api_key = str(os.getenv("API_KEY"))
# DATABASE_DB0 = str(os.getenv("DATABASE_DB0"))
# DATABASE_DB1 = str(os.getenv("DATABASE_DB1"))

# SAMANTA_CONTENT_EVALUATOR_EXPERINECED = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_EXPERINECED"))
# WORLD_PRICE_INDICATOR_EXPERINECED = str(os.getenv("WORLD_PRICE_INDICATOR_EXPERINECED"))
# LEGALZARD_EXPERINECED = str(os.getenv("LEGALZARD_EXPERINECED"))
# LOCATION_SPECIFIC_SEARCH_EXPERINECED = str(os.getenv("LOCATION_SPECIFIC_SEARCH_EXPERINECED"))
# WEBSITE_CRAWL_EXPERINECED = str(os.getenv("WEBSITE_CRAWL_EXPERINECED"))
# SEARCH_IN_LIVINGLAB_EXPERINECED = str(os.getenv("SEARCH_IN_LIVINGLAB_EXPERINECED"))
# DOWELL_CONTACT_US_EXPERINECED = str(os.getenv("DOWELL_CONTACT_US_EXPERINECED"))
# RANDOM_GRAPH_EXPERINECED = str(os.getenv("RANDOM_GRAPH_EXPERINECED"))
# DOWELL_PERMUTATION_CALCULATOR_EXPERINECED = str(os.getenv("DOWELL_PERMUTATION_CALCULATOR_EXPERINECED"))


# SAMANTA_CONTENT_EVALUATOR_USER = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_USER"))
# WORLD_PRICE_INDICATOR_USER = str(os.getenv("WORLD_PRICE_INDICATOR_USER"))
# LEGALZARD_USER = str(os.getenv("LEGALZARD_USER"))
# LOCATION_SPECIFIC_SEARCH_USER = str(os.getenv("LOCATION_SPECIFIC_SEARCH_USER"))
# WEBSITE_CRAWL_USER = str(os.getenv("WEBSITE_CRAWL_USER"))
# SEARCH_IN_LIVINGLAB_USER = str(os.getenv("SEARCH_IN_LIVINGLAB_USER"))
# DOWELL_CONTACT_US_USER = str(os.getenv("DOWELL_CONTACT_US_USER"))
# RANDOM_GRAPH_USER = str(os.getenv("RANDOM_GRAPH_USER"))
# DOWELL_PERMUTATION_CALCULATOR_USER = str(os.getenv("DOWELL_PERMUTATION_CALCULATOR_USER"))


# VOUCHER_SYSTEM = str(os.getenv("VOUCHER_SYSTEM"))
# CLIENT_VOUCHER_SYSTEM = str(os.getenv("CLIENT_VOUCHER_SYSTEM"))

"""Date Formatter for experience report"""
def generate_dates(start_date, time_period):
    date_format = "%d-%m-%Y"
    start_date = datetime.strptime(start_date, date_format)
    formatted_dates = [start_date.strftime(date_format)]

    if time_period == "one_day":
        return formatted_dates
    elif time_period == "seven_days":
        for _ in range(6):
            start_date -= timedelta(days=1)
            formatted_dates.append(start_date.strftime(date_format))
        return formatted_dates
    elif time_period == "one_month":
        for _ in range(30):
            start_date -= timedelta(days=1)
            formatted_dates.append(start_date.strftime(date_format))
        return formatted_dates
    else:
        return None
@method_decorator(csrf_exempt, name='dispatch')
class experiences_datacube_services(APIView):
    def post(self, request):
        type_request = request.GET.get('type')
    
        if type_request == "experienced_user_details":
            return self.experienced_user_details(request)
        elif type_request == "register_user":
            return self.register_user(request)
        elif type_request== "experienced_service_user_details":
            return self.experienced_service_user_details(request)
        elif type_request== "generate_coupon":
            return self.generate_coupon(request)
        elif type_request== "redeem_coupon":
            return self.redeem_coupon(request)
        elif type_request== "claim_coupon":
            return self.claim_coupon(request)
        elif type_request== "contribute":
            return self.contribute(request)
        else:
            return self.handle_error(request)
        
    def get(self, request): 
        type_request = request.GET.get('type')

        if type_request == "healt_check":
            return self.healt_check(request)
        elif type_request == "get_user_email":
            return self.get_user_email(request)
        elif type_request == "get_registered_user":
            return self.get_registered_user(request)
        elif type_request == "update_user_usage":
            return self.update_user_usage(request)
        elif type_request == "get_generated_coupons":
            return self.get_generated_coupons(request)
        elif type_request == "user_id_claim":
            return self.user_id_claim(request)  
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
            "SAMANTA CONTENT EVALUATOR": SAMANTA_CONTENT_EVALUATOR_EXPERINECED,
            "WORLD PRICE INDICATOR": WORLD_PRICE_INDICATOR_EXPERINECED,
            "LEGALZARD": LEGALZARD_EXPERINECED,
            "LOCATION SPECIFIC SEARCH": LOCATION_SPECIFIC_SEARCH_EXPERINECED,
            "WEBSITE CRAWL": WEBSITE_CRAWL_EXPERINECED,
            "SEARCH IN LIVINGLAB": SEARCH_IN_LIVINGLAB_EXPERINECED,
            "DOWELL CONTACT US" : DOWELL_CONTACT_US_EXPERINECED,
            "RANDOM GRAPH": RANDOM_GRAPH_EXPERINECED,
            "DOWELL PERMUTATION CALCULATOR": DOWELL_PERMUTATION_CALCULATOR_EXPERINECED,
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
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_EXPERINECED,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_EXPERINECED,
            "UXLIVINGLAB003": LEGALZARD_EXPERINECED,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_EXPERINECED,
            "UXLIVINGLAB005": WEBSITE_CRAWL_EXPERINECED,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_EXPERINECED,
            "UXLIVINGLAB007": DOWELL_CONTACT_US_EXPERINECED,
            "UXLIVINGLAB008": RANDOM_GRAPH_EXPERINECED,
            "UXLIVINGLAB009": DOWELL_PERMUTATION_CALCULATOR_EXPERINECED,
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

    """Register a new email address"""
    def register_user(self, request):
        email = request.data.get("email")
        product_number = request.data.get("product_number")

        serializer = ExperiencedUserDetailsSerializer(data={"email": email, "product_number": product_number})

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        db0_collection = {
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_USER,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_USER,
            "UXLIVINGLAB003": LEGALZARD_USER,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_USER,
            "UXLIVINGLAB005": WEBSITE_CRAWL_USER,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER,
            "UXLIVINGLAB007": DOWELL_CONTACT_US_USER,
            "UXLIVINGLAB008": RANDOM_GRAPH_USER,
            "UXLIVINGLAB009": DOWELL_PERMUTATION_CALCULATOR_USER,
        }
        db_user_collection_name = db0_collection.get(product_number)

        check_user_present = json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            db_user_collection_name,
            {"email": email},
            10000,
            0,
            False
        ))

        if not check_user_present.get("data"):
            email_verification = json.loads(verify_email(email))
            if not email_verification.get("success"):
                return Response({
                    "success": False,
                    "message": email_verification.get("message", "Email verification failed")
                }, status=status.HTTP_400_BAD_REQUEST)

            response = json.loads(datacube_data_insertion(
                api_key,
                DATABASE_DB0,
                db_user_collection_name,
                {
                    "email": email,
                    "total_times": 5,
                    "used_time": 0,
                    "registered_on": get_formatted_date()["formatted_date"],
                    "registered_at": get_formatted_date()["formatted_time"],
                    "is_active": True,
                    "is_paid": False,
                    "paid_on": "",
                    "paid_at": "",
                    "is_redeemed": True,
                    "redeemtion_counts": 0, 
                    "records": [{"record": "1", "type": "overall"}]
                }
            ))

            if not response.get("success"):
                return Response({
                    "success": False,
                    "message": "Failed to insert data into the database",
                    "database_response": {
                        "success": response.get("success"),
                        "message": response.get("message"),
                    },
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "success": True,
                "message": "Experienced user details saved successfully",
                "database_response": {
                    "success": response.get("success"),
                    "message": response.get("message"),
                    "inserted_id": response.get("data", {}).get("inserted_id"),
                },
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": True,
            "message": "Experienced user details already exist"
        }, status=status.HTTP_200_OK)

    """Registered user details"""
    def get_registered_user(self, request):
        email = request.GET.get("email")
        product_number = request.GET.get("product_number")

        serializer= ExperiencedUserDetailsSerializer(data = {
            "email": email,
            "product_number": product_number
        })

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        db0_collection = {
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_USER,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_USER,
            "UXLIVINGLAB003": LEGALZARD_USER,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_USER,
            "UXLIVINGLAB005": WEBSITE_CRAWL_USER,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER,
            "UXLIVINGLAB007": DOWELL_CONTACT_US_USER,
            "UXLIVINGLAB008": RANDOM_GRAPH_USER,
            "UXLIVINGLAB009": DOWELL_PERMUTATION_CALCULATOR_USER,
        }
       
        db_user_collection_name = db0_collection.get(product_number)
        
        response = json.loads(datacube_data_retrival(
            api_key, 
            DATABASE_DB0,
            db_user_collection_name,
            {
                "email": email
            },
            1000000,
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
        
        return Response({
            "success": True,
            "message": "Date retrived successfully",
            "response": response.get("data",[])
        },status=status.HTTP_200_OK)
    
    """Update user usage/ reduce number of usage"""
    def update_user_usage(self, request):
        email = request.GET.get("email")
        product_number = request.GET.get("product_number")
        occurrences = int(request.GET.get("occurrences"))


        serializer= ReduceExperiencedSerializer(data = {
            "email": email,
            "product_number": product_number,
            "occurrences": occurrences
        })

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        db0_collection = {
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_USER,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_USER,
            "UXLIVINGLAB003": LEGALZARD_USER,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_USER,
            "UXLIVINGLAB005": WEBSITE_CRAWL_USER,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER,
            "UXLIVINGLAB007": DOWELL_CONTACT_US_USER,
            "UXLIVINGLAB008": RANDOM_GRAPH_USER,
            "UXLIVINGLAB009": DOWELL_PERMUTATION_CALCULATOR_USER,
        }
        db_user_collection_name = db0_collection.get(product_number)
        response = json.loads(datacube_data_update(
            api_key,
            DATABASE_DB0,
            db_user_collection_name,
            {
                "email": email,
            },
            {
                "used_time": occurrences,
                "records": [{
                    "record": "1",
                    "type": "overall_updated"
                }]
            }
        ))

        if not response["success"]:
            return Response({
                "success": False,
                "message": "Failed to update data",
                "database_response": {
                    "success": response["success"],
                    "message": response["message"],
                },
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "success": True,
                "message": "Date updated successfully",
                "database_response": {
                    "success": response["success"],
                    "message": response["message"],
                },
        },status=status.HTTP_200_OK)
    
    """Experienced services user details"""
    def experienced_service_user_details(self, request):
        email = request.data.get("email")
        product_number = request.data.get("product_number")
        occurrences = request.data.get("occurrences")

        serializer = ExperiencedUserDetailsSerializer(data={
            "email": email,
            "product_number": product_number
        })

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Incorrect data sent to API",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        db0_collection = {
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_USER,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_USER,
            "UXLIVINGLAB003": LEGALZARD_USER,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_USER,
            "UXLIVINGLAB005": WEBSITE_CRAWL_USER,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER,
            "UXLIVINGLAB007": DOWELL_CONTACT_US_USER,
            "UXLIVINGLAB008": RANDOM_GRAPH_USER,
            "UXLIVINGLAB009": DOWELL_PERMUTATION_CALCULATOR_USER,
        }

        db_user_collection_name = db0_collection.get(product_number)

        response = json.loads(datacube_data_retrival(
            api_key, 
            DATABASE_DB0,
            db_user_collection_name,
            {"email": email},
            1000000,
            0,
            False
        ))

        if not response.get("success", False):
            return Response({
                "success": False,
                "message": "Failed to retrieve data from the database",
                "database_response": {
                    "success": response.get("success", False),
                    "message": response.get("message", "Unknown error"),
                },
            }, status=status.HTTP_400_BAD_REQUEST)
        user_data = response.get("data", [])

        if not user_data:
            return Response({"success": False, "message": "No user data found."})

        user_info = user_data[0]
        is_active = user_info.get("is_active", False)
        is_paid = user_info.get("is_paid", False)
        total_time = user_info.get("total_times", 0)
        used_time = user_info.get("used_time", 0)

        if not is_active:
            return Response({
                "success": False, 
                "message": "Your account has been suspended , Please contact our customer support team. Thank you"
            })

        if not is_paid:
            if total_time < occurrences:
                
                return Response({
                    "success": False, 
                    "message": "Exceeded experienced limits. Please contact our customer support team. Thank you"
                },)
        else:
            if total_time < used_time:
                return Response({
                    "success": False, 
                    "message": "Exceeded experienced limits. Please contact our customer support team. Thank you"
                })

        return Response({
            "success": True,
            "message": "Data retrieved successfully",
            "response": response.get("data", [])
        }, status=status.HTTP_200_OK)
    
    """Get generated Coupons"""
    def get_generated_coupons(self, request):
        limit = request.GET.get("limit")
        offset = request.GET.get("offset")
        is_active = int(request.GET.get("is_active", 0))
        is_redeem = int(request.GET.get("is_redeem", 0))
        is_claimed = int(request.GET.get("is_claimed", 0))

        is_active = bool(is_active)
        is_redeem = bool(is_redeem)
        is_claimed = bool(is_claimed)

        response = json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            VOUCHER_SYSTEM,
            {
                "$and": [{"is_active": is_active}, {"is_redeem": is_redeem},{"is_claimed": is_claimed}]
            },
            limit,
            offset,
            False
        ))

        if not response["success"]:
            return Response({
                "success": False,
                "message": response["message"]
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "success": True,
            "message": "List of available coupons data",
            "response": response.get("data", []),
        }, status=status.HTTP_200_OK)

    """Generate Coupons"""
    def generate_coupon(self, request):
        number_of_coupons = int(request.data.get("number_of_coupons"))

        serializer = GenerateCouponSerializer(data={"number_of_coupons": number_of_coupons})
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        
        coupons = [generate_coupons(6) for _ in range(number_of_coupons)]

        data_to_be_inserted = []
        for coupon in coupons:
            data_to_be_inserted.append({
                "coupon_name": coupon,
                "created_at": get_formatted_date()["formatted_time"],
                "created_on": get_formatted_date()["formatted_date"],
                "is_active": True,
                "is_redeem": False,
                "is_claimed": False,
                "records": [{"record": "1", "type": "overall"}]
            })

        for data in data_to_be_inserted:
            response = json.loads(datacube_data_insertion(
                api_key,
                DATABASE_DB0,
                VOUCHER_SYSTEM,
                data,
            ))

            if not response["success"]:
                return Response({
                    "success": False,
                    "message": "Failed to create coupon"
                }) 

        return Response({
            "success": True,
            "message": "Coupons added successfully",
            "coupons": data_to_be_inserted
        })

    """Claim coupon by BD people"""
    def claim_coupon(self, request):
        number_of_coupons_to_claim = request.data.get('number_of_coupons_to_claim')


        existing_coupon = json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            VOUCHER_SYSTEM,
            {
                "$and": [{"is_active": True}, {"is_redeem": False},{"is_claimed": False}]
            },
            number_of_coupons_to_claim,
            0,
            False
        ))
        
        coupons_data = existing_coupon["data"]
        if len(coupons_data) == 0:
            return Response({
                "success": False,
                "message": "There is no available coupon to claim"
            }, status=status.HTTP_404_NOT_FOUND)
        
        list_of_coupons = []
        for coupon in coupons_data:
            list_of_coupons.append(coupon["coupon_name"])
            response = json.loads(datacube_data_update(
                api_key,
                DATABASE_DB0,
                VOUCHER_SYSTEM,
                {
                    "_id":coupon["_id"]
                },
                {
                    "is_claimed": True
                }
            ))

            if not response['success']:
                return Response({
                    "success": False,
                    "message": f"Failed to update is_claimed status for {coupon['coupon_name']}",
                    "database_response": {
                        "success": response['success'],
                        "message": response['message']
                    }
                })
        
        return Response({
            "success": True,
            "message": "Coupons claimed successfully",
            "coupon_claimed": list_of_coupons,
        })

    """Redeem Coupons"""
    def redeem_coupon(self, request):
        email = request.data.get("email")
        coupon = request.data.get("coupon")
        product_number = request.data.get("product_number")

        serializer = UseCouponSerializer(data={"email": email, "coupon": coupon, "product_number": product_number})
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)

        db0_collection = {
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_USER,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_USER,
            "UXLIVINGLAB003": LEGALZARD_USER,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_USER,
            "UXLIVINGLAB005": WEBSITE_CRAWL_USER,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER,
            "UXLIVINGLAB007": DOWELL_CONTACT_US_USER,
            "UXLIVINGLAB008": RANDOM_GRAPH_USER,
            "UXLIVINGLAB009": DOWELL_PERMUTATION_CALCULATOR_USER,
        }

        db_user_collection_name = db0_collection.get(product_number)

        # Retrieve coupon data
        coupon_data = self.retrieve_coupon_data(coupon)
        if not coupon_data["success"]:
            return Response({
                "success": False,
                "message": coupon_data["message"]
            })

        if len(coupon_data["data"]) ==0 :
            return Response({
                "success": False,
                "message": "Coupon is not available"
            })
        data = coupon_data.get("data", [])[0]

        if not data["is_active"]:
            return Response({
                "success": False,
                "message": "Coupon is not active. Please ask for a different coupon. Thank you",
            }, status=status.HTTP_401_UNAUTHORIZED)

        if data["is_redeem"]:
            return Response({
                "success": False,
                "message": "Coupon has already been redeemed.",
            }, status=status.HTTP_226_IM_USED)

        user_data = self.retrieve_user_data(db_user_collection_name, email)
        if not user_data["success"]:
            return Response({
                "success": False,
                "message": "Failed to retrieve user information"
            }, status=status.HTTP_404_NOT_FOUND)
        
        
        if not user_data["data"][0]["is_active"]:
            return Response({
                "success": False,
                "message": "Your account has been disabled. Please contact customer support. Thank you"
            })

        update_user_usage = self.update_user_usages(db_user_collection_name, email, user_data)
        if not update_user_usage["success"]:
            return Response({
                "success": False,
                "message": "Failed to redeem the coupon",
                "database_response": {
                    "success": update_user_usage["success"],
                    "message": update_user_usage["message"]
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        update_coupon_status_ = self.update_coupon_status(coupon)

        experienced_user_metadata = Thread(target=self.save_client_voucher_masterdb, args=(email, db_user_collection_name, coupon))
        experienced_user_metadata.start()

        return Response({
            "success": True,
            "message": "You have free experienced time"
        }, status=status.HTTP_200_OK)

    def retrieve_coupon_data(self, coupon):
        return json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            VOUCHER_SYSTEM,
            {"coupon_name": coupon},
            1,
            0,
            False
        ))

    def retrieve_user_data(self, db_user_collection_name, email):
        return json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            db_user_collection_name,
            {"email": email},
            1,
            0,
            False
        ))

    def update_user_usages(self, db_user_collection_name, email, user_data):
        return json.loads(datacube_data_update(
            api_key,
            DATABASE_DB0,
            db_user_collection_name,
            {"email": email},
            {
                "total_times": user_data["data"][0]["total_times"] + 1,
                "is_redeemed": True,
                "redeemtion_counts": user_data["data"][0].get("redeemtion_counts", 0) + 1
            }
        ))
    
    def update_coupon_status(self, coupon_name):
        return json.loads(datacube_data_update(
            api_key,
            DATABASE_DB0,
            VOUCHER_SYSTEM,
            {
                "coupon_name": coupon_name
            },
            {
                "is_redeem": True,
                "is_active": False
            }
        ))

    def save_client_voucher_masterdb(self, email, db_user_collection_name, coupon):
        datacube_data_insertion(
            api_key,
            DATABASE_DB0,
            CLIENT_VOUCHER_SYSTEM,
            {
                "email": email,
                "product_name": db_user_collection_name,
                "coupon_used": coupon,
                "redeemed_on": get_formatted_date()["formatted_date"],
                "redeemed_at": get_formatted_date()["formatted_time"],
                "records": [{"record": "1", "type": "overall"}]
            }
        )

    "User ids to claim voucher"
    def user_id_claim(self, request):
        user_id = request.GET.get('user_id')
        list_of_user_ids = ["649064f2e142d4568c876ba6","62e47fb67cb119927d3f0db9","639bfefd2375723f623d2498","645e312d1ce598e073724ff6","6363ee91137d4469c7382a33","64d32fbb9a88146462806fd2"]

        if user_id in list_of_user_ids:
            return Response({
                "success": True,
                "message": f"{user_id} is authorized to access this page."
            }, status= status.HTTP_202_ACCEPTED)
        else:
            return Response({
                "success": False,
                "message": f"{user_id} is not authorized to access this page."
            }, status= status.HTTP_401_UNAUTHORIZED)   
         
    """Contribute by users"""
    def contribute(self, request):
        email = request.data.get("email")
        product_number = request.data.get("product_number")

        serializer = ExperiencedUserDetailsSerializer(data={"email": email, "product_number": product_number})

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        db0_collection = {
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_USER,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_USER,
            "UXLIVINGLAB003": LEGALZARD_USER,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_USER,
            "UXLIVINGLAB005": WEBSITE_CRAWL_USER,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER,
            "UXLIVINGLAB007": DOWELL_CONTACT_US_USER,
        }
        db_user_collection_name = db0_collection.get(product_number)
        user_data = json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            db_user_collection_name,
            {
                "email": email
            },
            1,
            0,
            False
        ))
        existing_user_data = user_data.get("data",[])
        if not existing_user_data:
            return Response({
                "success": False,
                "message": "No user was found"
            },status=status.HTTP_404_NOT_FOUND)
        
        response = json.loads(datacube_data_update(
            api_key,
            DATABASE_DB0,
            db_user_collection_name,
            {
                "_id": existing_user_data[0]["_id"]
            },
            {
                "total_times" : existing_user_data[0]["total_times"] + 100,
                "is_paid": True,
                "paid_on": get_formatted_date()["formatted_date"],
                "paid_at": get_formatted_date()["formatted_time"]
            }
        ))

        if not response["success"]:
            return Response({
                "success": False,
                "message": "Something went wrong while adding the points. Please try again later."
            })
        return Response({
            "success":True,
            "message":"Thank you for your contributions"
        },status= status.HTTP_200_OK)

    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)



@method_decorator(csrf_exempt, name='dispatch')
class experiences_report(APIView):
    def post(self, request): 
        type_request = request.GET.get('type')

        if type_request == "user_experiences_count":
            return self.user_experiences_count(request)
        elif type_request == "retrive_data":
            return self.retrive_data(request)
        else:
            return self.handle_error(request)   
    
 
    """Experiences count for user and total for report"""
    def user_experiences_count(self, request):
        email = request.data.get('email')
        date = request.data.get('date')
        time_period = request.data.get('time_period')
        product_number = request.data.get('product_number')
        date_type = request.data.get('date_type')

        serializer = ReportUserExperiencedCountSerializer(data={"email": email, "time_period": time_period, "date": date, "product_number": product_number, "date_type": date_type})

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        formatted_dates = generate_dates(date, time_period)

        db0_collection_mapping = {
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_EXPERINECED,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_EXPERINECED,
            "UXLIVINGLAB003": LEGALZARD_EXPERINECED,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_EXPERINECED,
            "UXLIVINGLAB005": WEBSITE_CRAWL_EXPERINECED,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_EXPERINECED,
            "UXLIVINGLAB007":DOWELL_CONTACT_US_EXPERINECED
        }

        db0_collection_name = db0_collection_mapping.get(product_number)

        or_conditions = [
            {"experienced_date": formatted_date} for formatted_date in formatted_dates
        ]

        query = {"$or": or_conditions}

        if email:
            query["$and"] = [{"email": email}]

        response = json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            db0_collection_name,
            query,
            1000000,
            0,
            False
        ))

        if not response["success"]:
            return Response({
                "success": False,
                "message": f"Could not retrieve data for email {email}"
            }, status=status.HTTP_404_NOT_FOUND)

        day_count = {}

        for entry in response["data"]:
            experienced_date = entry["experienced_date"]
            day_count[experienced_date] = day_count.get(experienced_date, 0) + 1

        result_data = [{"date": date, "count": day_count.get(date, 0)} for date in formatted_dates]

        if email:
            return Response({
                "success": True,
                "message": f"Data retrieved for email {email} successfully",
                "response": result_data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "success": True,
                "message": "Report for experienced count was successfully generated",
                "response": result_data
            }, status=status.HTTP_201_CREATED)

    """Output for datacube client"""
    def retrive_data(self, request):
        database=request.data.get("database_name")
        collection_name = request.data.get("collection_name")
        limit = request.data.get("limit")
        offset= request.data.get("offset")
        
        response =json.loads(datacube_data_retrival(
            api_key,
            database,
            collection_name,
            {},
            limit,
            offset,
            False
        ))
        
        if not response["success"]:
            return Response({
                "success":False,
                "message":"No data or something went wrong"
            }, status= status.HTTP_404_NOT_FOUND)
        return Response({
            "success": True,
            "message": "Data retrived successfully",
            "response": response["data"]
        },status=status.HTTP_200_OK)
    
    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)




        
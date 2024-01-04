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

SAMANTA_CONTENT_EVALUATOR_USER = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_USER"))
WORLD_PRICE_INDICATOR_USER = str(os.getenv("WORLD_PRICE_INDICATOR_USER"))
LEGALZARD_USER = str(os.getenv("LEGALZARD_USER"))
LOCATION_SPECIFIC_SEARCH_USER = str(os.getenv("LOCATION_SPECIFIC_SEARCH_USER"))
WEBSITE_CRAWL_USER = str(os.getenv("WEBSITE_CRAWL_USER"))
SEARCH_IN_LIVINGLAB_USER = str(os.getenv("SEARCH_IN_LIVINGLAB_USER"))

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

# SAMANTA_CONTENT_EVALUATOR_USER = str(os.getenv("SAMANTA_CONTENT_EVALUATOR_USER"))
# WORLD_PRICE_INDICATOR_USER = str(os.getenv("WORLD_PRICE_INDICATOR_USER"))
# LEGALZARD_USER = str(os.getenv("LEGALZARD_USER"))
# LOCATION_SPECIFIC_SEARCH_USER = str(os.getenv("LOCATION_SPECIFIC_SEARCH_USER"))
# WEBSITE_CRAWL_USER = str(os.getenv("WEBSITE_CRAWL_USER"))
# SEARCH_IN_LIVINGLAB_USER = str(os.getenv("SEARCH_IN_LIVINGLAB_USER"))

# VOUCHER_SYSTEM = str(os.getenv("VOUCHER_SYSTEM"))
# CLIENT_VOUCHER_SYSTEM = str(os.getenv("CLIENT_VOUCHER_SYSTEM"))


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
        elif type_request== "use_coupons":
            return self.use_coupons(request)
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
            "SEARCH IN LIVINGLAB": SEARCH_IN_LIVINGLAB_EXPERINECED
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
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_EXPERINECED,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_EXPERINECED,
            "UXLIVINGLAB003": LEGALZARD_EXPERINECED,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_EXPERINECED,
            "UXLIVINGLAB005": WEBSITE_CRAWL_EXPERINECED,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_EXPERINECED
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
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER
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
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER
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
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER
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
        print(email)
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
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER
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
                print("----")
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
    
    """User Coupons"""
    def get_generated_coupons(self, request):

        response = json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            VOUCHER_SYSTEM,
            {
                "_id":"65932b9d31188f54bdc96531"
            },
            1,
            0,
            False
        ))

        if not response["success"]:
            return Response({
                "success": False,
                "message": response["message"]
            })
        
        return Response({
            "success": True,
            "message": "List of available coupons data",
            "database_response": {
                "success": response["success"],
                "message": response["message"],
            },
            "response": response["data"][0]["coupon_generated"]
        })
    
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
        
        existing_coupon = json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            VOUCHER_SYSTEM,
            {
                "_id":"65932b9d31188f54bdc96531"
            },
            1,
            0,
            False
        ))
        coupons_data = existing_coupon["data"][0]
        existing_coupons = coupons_data.get("coupon_generated", [])

        for i in range(number_of_coupons):
            existing_coupons.append(generate_coupons(6))  

        coupons_data["coupon_generated"] = existing_coupons 
        
        time = get_formatted_date()

        response = json.loads(datacube_data_update(
            api_key,
            DATABASE_DB0,
            VOUCHER_SYSTEM,
            {
                "_id":"65932b9d31188f54bdc96531"
            },
            {
                "coupon_generated": coupons_data["coupon_generated"],
                # "created_on":time["formatted_date"],
                # "created_at":time["formatted_time"]
            }
        ))
        if not response['success']:
            return Response({
                "success": False,
                "message": "Failed to create coupons",
                "database_response": {
                    "success": response['success'],
                    "message": response['message']
                }
            })

        return Response({
            "success": True,
            "message": "Coupons added successfully",
            "database_rersponse": {
                "success": response["success"],
                "message": response["message"]
            },
            "coupons": coupons_data["coupon_generated"]
        })

    def use_coupons(self,request):
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
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_USER
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
      
        update_user_usage = json.loads(datacube_data_update(
            api_key,
            DATABASE_DB0,
            db_user_collection_name,
            {
                "email": email
            },
            {
                "total_times": existing_user_data[0]["total_times"] + 1
            }
        ))

        if not update_user_usage["success"]:
            return Response({
                "success":False,
                "message":"Failed to reddem the coupon",
                "database_response":{
                    "success":update_user_usage["success"],
                    "message":update_user_usage["message"]
                }
            },status= status.HTTP_400_BAD_REQUEST)
        
        def save_client_voucher_masterdb():
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

        experienced_user_metadata = Thread(target=save_client_voucher_masterdb)
        experienced_user_metadata.start()
        
        return Response({
            "success":True,
            "message":"Experience time increased by 1"
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

        if type_request == "user_experiences_date_wise":
            return self.user_experiences_date_wise(request)
        elif type_request == "user_experiences_count":
            return self.user_experiences_count(request)
        else:
            return self.handle_error(request)   
    
    def user_experiences_date_wise(self, request):
        collection_data = json.loads(datacube_collection_retrival(
            api_key,
            DATABASE_DB1
        ))
        print(collection_data["data"])
        collection_names = get_dates(collection_data["data"], "seven_days", "04_01_2024")

        # Filter out only the names with '_uxlivinglab_org'
        collection_name = get_dates(collection_data["data"], "seven_days", "04_01_2024")

        data = []  
        for data_name in collection_name["present_dates"]:
            response = json.loads(datacube_data_retrival(
                api_key,
                DATABASE_DB1,
                data_name,
                {},
                1000,
                0,
                False
            ))
            data.append(response)

        return Response(data, status=status.HTTP_200_OK)

        return Response(data, status=status.HTTP_200_OK) 


    def user_experiences_count(self, request):
        date_type = request.data.get('date_type')
        date = request.data.get('date')
        product_number = request.data.get('product_number')

        serializer = ReportUserExperiencedCountSerializer(data={"date_type": date_type,"date": date,"product_number": product_number})

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        given_date = datetime.strptime(date, "%d-%m-%Y").date()

        db0_collection_mapping = {
            "UXLIVINGLAB001": SAMANTA_CONTENT_EVALUATOR_EXPERINECED,
            "UXLIVINGLAB002": WORLD_PRICE_INDICATOR_EXPERINECED,
            "UXLIVINGLAB003": LEGALZARD_EXPERINECED,
            "UXLIVINGLAB004": LOCATION_SPECIFIC_SEARCH_EXPERINECED,
            "UXLIVINGLAB005": WEBSITE_CRAWL_EXPERINECED,
            "UXLIVINGLAB006": SEARCH_IN_LIVINGLAB_EXPERINECED
        }

        db0_collection_name = db0_collection_mapping.get(product_number)
        response = json.loads(datacube_data_retrival(
            api_key,
            DATABASE_DB0,
            db0_collection_name,
            {},
            100000,
            0,
            False
        ))
        
        data = response["data"]
        dates = [datetime.strptime(record["experienced_date"], "%d-%m-%Y").date() for record in data]
        times = {str(datetime.strptime(record["experienced_date"], "%d-%m-%Y").date()): [] for record in data}

        for record in data:
            times[str(datetime.strptime(record["experienced_date"], "%d-%m-%Y").date())].append(record["experienced_time"])

        if date_type == "seven_days":
            date_range = [given_date - timedelta(days=i) for i in range(7)]
        elif date_type == "one_day":
            date_range = [given_date]
        elif date_type == "one_month":
            date_range = [given_date - timedelta(days=i) for i in range(30)]
        else:
            return Response({"error": "Invalid date_type"}, status=status.HTTP_400_BAD_REQUEST)

        date_count = {str(day): dates.count(day) for day in date_range}

        present_dates = [{"date": str(day), "count": date_count[str(day)], "experienced_time": times.get(str(day), [])} for day in date_range if date_count.get(str(day), 0) > 0]
        not_present_dates = [{"date": str(day), "count": 0, "experienced_time": []} for day in date_range if date_count.get(str(day), 0) == 0]

        return Response({
            "success": True,
            "message": "Report for experienced count was successfully generated",
            "present_dates": present_dates, 
            "not_present_dates": not_present_dates
        }, status=status.HTTP_201_CREATED)

    """HANDLE ERROR"""
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
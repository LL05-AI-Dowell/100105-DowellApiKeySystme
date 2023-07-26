from utils.constant import *
from utils.helper import *
import datetime
import json

"""SAVE SERVICES"""
def save_service(service_id,name,description,link,credits,service_type):
    field = {
        "service_id": service_id,
        "name": name,
        "description": description,
        "link": link,
        "credits": credits,
        "service_type": service_type,
        "is_active": False,
        "is_released": True,
        "created_at": datetime.datetime.now().strftime('%Y-%m-%d')
    }
    fetch_field = {
        "ids": service_id,
        "name": name
    }
    update_field = {
        "status": "Nothing to udpate"
    }
    responses = json.loads(dowellconnection(*Services,"fetch",fetch_field,update_field))
    for item in responses.get('data', []):
        if item['service_id'] == service_id and item['name'] == name:
            return False
    response = json.loads(dowellconnection(*Services,"insert", field , update_field))
    if response["isSuccess"]:
        return True
    else:
        return False

"""GET SERVICE"""
def get_service(field,update_field):
    response = json.loads(dowellconnection(*Services,"find",field,update_field))
    if not response["data"] == None:
        return {
            "success": True,
            "message": "Service details",
            "data": response['data']
        }
    else: 
        return {
            "success": False,
            "message": "Service is not found"
        }

"""GET ALL SERVICES"""
def get_all_services(field,update_field):
    response = json.loads(dowellconnection(*Services,"fetch",field,update_field))
    if not response["data"] == None:
        return {
            "success": True,
            "message": "List of all Services",
            "data": response['data']
        }
    else: 
        return {
            "success": False,
            "message": "Service is not found"
        }

"""SAVE VOUCHER"""
def save_voucher(name,description,code,discount):
    field = {
        "name": name,
        "description": description,
        "code": code,
        "discount": discount,
        "is_active": True,
        "created_at": datetime.datetime.now().strftime('%Y-%m-%d')
    }
    fetch_field = {
        "is_active": True
    }
    update_field = {
        "is_active": False
    }
    responses = json.loads(dowellconnection(*Voucher_Services,"fetch",fetch_field,update_field))
    print(responses)
    for item in responses.get('data', []):
        if item['is_active'] == True :
            fields = {
                "_id": item["_id"]
            }
            responses = json.loads(dowellconnection(*Voucher_Services,"update",fetch_field,update_field))   
    
    response = json.loads(dowellconnection(*Voucher_Services,"insert", field , update_field))
    if response["isSuccess"]:
        return True
    else:
        return False

"""GET ALL ACTIVE VOUCHER"""    
def get_active_voucher(field,update_field):
    field = field
    update_field = update_field
    response = json.loads(dowellconnection(*Voucher_Services,"fetch", field, update_field))
    return response['data']

"""SAVE USER API KEY"""
def save_user_key(api_key, username, email, userId, userDetails ):
    field = {
        "api_key": api_key,
        "username": username,
        "email": email,
        "userId": userId,
        "userDetails": userDetails,
        "is_active": False,
        "is_redeemed": False,
        "services": [],
        "is_paid": False,
        "used_credits": None,
        "total_credits": None,
        "created_at": datetime.datetime.now().strftime('%Y-%m-%d')
    }
    fetch_field = {
        "username": username,
        "email": email,
        "userId": userId
    }
    update_field = {
        "status": "Nothing to udpate"
    }
    responses = json.loads(dowellconnection(*User_Services,"fetch",fetch_field,update_field))
    for item in responses.get('data', []):
        if item['username'] == username and item['email'] == email and item['userId'] == userId:
            return {
                "success": False,
                "message": "User API key already exists",
                "data": responses["data"][0]
            }
    response = json.loads(dowellconnection(*User_Services,"insert", field , update_field))
    if response["isSuccess"]:
        return {
            "success": True,
            "message":"User API key created successfully",
            "data": field
        }
    else:
        return {
            "success": False,
            "message": "Something went wrong"
        }

"""GET VOUCHER DISCOUNT"""
def get_voucher_discount(code):
    field= {
        "code": code,
        "is_active": True
    }
    update_field= {
        "status": "Nothing to update"
    }
    response= json.loads(dowellconnection(*Voucher_Services,"find",field,update_field))
    if not response["data"] == None :
        return {
            "success": True,
            "message": "Voucher code was found successfully",
            "data": response["data"]["discount"]
        }
    else: 
        return {
            "success": False,
            "message": "Voucher code is either inactive or invalid"
        }

"""ACTIVATE USER API KEY"""
def activate_key(field,update_field):
    response= json.loads(dowellconnection(*User_Services,"find",field,update_field))
    if not response["data"] == None :
        if not response["data"]["is_active"]:
            response = json.loads(dowellconnection(*User_Services,"update",field,update_field))
            return {
                "success": True,
                "message":"API key is activated successfully"
            }
        else:
            return {
                "success":False,
                "message": "API key already activated"
            }
    else:
        return {
            "success": False,
            "message": "API key not found"
        }

"""DEACTIVATE USER API KEY"""
def deactivate_key(field,update_field):
    response = json.loads(dowellconnection(*User_Services,"update",field,update_field))
    return {
        "success":True,
        "message": "API key deactivated successfully"
    }

"""GET SERVICES TO ADD IN USER KEY"""
def get_services():
    field = {
        "is_released": True,
    }
    update_field = {
        "status": "Nothing to retrieve",
    }

    services_list = []

    service_response = json.loads(dowellconnection(*Services, "fetch", field, update_field))
    print(service_response)
    for service in service_response.get("data", []):
        service_data = {
            "service_id": service.get("service_id"),
            "is_active": service.get("is_active")
        }
        services_list.append(service_data)

    return services_list

"""ADD NEW SERVICES TO USER API KEY"""
def user_service_updation(field, update_field):
    response = json.loads(dowellconnection(*User_Services, "fetch", field, update_field))
    if not response["data"] == None :
        service = get_services()
        response_service_ids = {s["service_id"] for s in response["data"][0]["services"]}
        new_services = [s for s in service if s["service_id"] not in response_service_ids]

        response["data"][0]["services"].extend(new_services)
        
        update_field = {
            "services": response["data"][0]["services"] 
        }
        response = json.loads(dowellconnection(*User_Services,"update",field, update_field))
        if response["isSuccess"] :
            return {
                "success": True,
                "message": "New services are added to existing users"
            }
        else:
            return {
                "success": False,
                "message": "SOmething went wrong"
            }
    else:
        return {
            "success": False,
            "message": "Something went wrong"
        }

"""ACTIVATE/DEACTIVATE USER SERVICE"""
def activate_deactivate_services(service_id, field):
    response = json.loads(dowellconnection(*User_Services, "find", field, update_field=None))
    service_list = response["data"]["services"]
    for service in service_list:
        if service["service_id"] == service_id:
            service["is_active"] = not service["is_active"]
            break
    update_field = {
        "services": service_list
    }
    response = json.loads(dowellconnection(*User_Services, "update", field, update_field))
    if response["isSuccess"]:
        action = "activated" if service["is_active"] else "deactivated"
        return {
            "success": True,
            "message": f"{service_id} is {action}"
        }
    else:
        return {
            "success": False,
            "message": f"{service_id} failed to activate or deactivate"
        }

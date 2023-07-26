from utils.constant import *
from utils.helper import *
import datetime
import json

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

def deactivate_key(field,update_field):
    response = json.loads(dowellconnection(*User_Services,"update",field,update_field))
    return {
        "success":True,
        "message": "API key deactivated successfully"
    }
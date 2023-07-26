from utils.constant import *
from utils.helper import *
import datetime
import json

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
    
def get_active_voucher(field,update_field):
    field = field
    update_field = update_field
    response = json.loads(dowellconnection(*Voucher_Services,"fetch", field, update_field))
    return response['data']
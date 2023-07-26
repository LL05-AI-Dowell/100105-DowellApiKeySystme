from utils.constant import *
from utils.helper import *
import datetime
import json

def save_apiservice(ids,name,description,link,credits):
    field = {
        "ids": ids,
        "name": name,
        "description": description,
        "link": link,
        "credits": credits,
        "is_active": False,
        "is_released": True,
        "created_at": datetime.datetime.now().strftime('%Y-%m-%d')
    }
    fetch_field = {
        "ids": ids,
        "name": name
    }
    update_field = {
        "status": "Nothing to udpate"
    }
    responses = json.loads(dowellconnection(*API_Services,"fetch",fetch_field,update_field))
    for item in responses.get('data', []):
        if item['ids'] == ids and item['name'] == name:
            return False
    response = json.loads(dowellconnection(*API_Services,"insert", field , update_field))
    if response["isSuccess"]:
        return True
    else:
        return False
    
def save_moduleservice(ids,name,description,link,credits,api_service_ids,module_type):
    field = {
        "ids": ids,
        "name": name,
        "description": description,
        "link": link,
        "credits": credits,
        "is_active": False,
        "is_released": True,
        "api_service_ids": api_service_ids,
        "module_type": module_type,
        "created_at": datetime.datetime.now().strftime('%Y-%m-%d')
    }
    fetch_field = {
        "ids": ids,
        "name": name
    }
    update_field = {
        "status": "Nothing to udpate"
    }
    responses = json.loads(dowellconnection(*Services,"fetch",fetch_field,update_field))
    for item in responses.get('data', []):
        if item['ids'] == ids and item['name'] == name:
            return False
    response = json.loads(dowellconnection(*Services,"insert", field , update_field))
    if response["isSuccess"]:
        return True
    else:
        return False

def save_productservice(ids,name,description,link,credits,service_ids):
    field = {
        "ids": ids,
        "name": name,
        "description": description,
        "link": link,
        "credits": credits,
        "is_active": False,
        "is_released": True,
        "service_ids": service_ids,
        "created_at": datetime.datetime.now().strftime('%Y-%m-%d')
    }
    fetch_field = {
        "ids": ids,
        "name": name
    }
    update_field = {
        "status": "Nothing to udpate"
    }
    responses = json.loads(dowellconnection(*Product_Services,"fetch",fetch_field,update_field))
    for item in responses.get('data', []):
        if item['ids'] == ids and item['name'] == name:
            return False
    response = json.loads(dowellconnection(*Product_Services,"insert", field , update_field))
    if response["isSuccess"]:
        return True
    else:
        return False
    
def get_api_service(field,update_field):
    field = field
    update_field = update_field
    response = json.loads(dowellconnection(*API_Services,"fetch", field, update_field))
    return response['data']

def get_module_service(field,update_field):
    field = field
    update_field = update_field
    response = json.loads(dowellconnection(*Services,"fetch", field, update_field))
    return response['data']

def get_product_service(field,update_field):
    field = field
    update_field = update_field
    response = json.loads(dowellconnection(*Product_Services,"fetch", field, update_field))
    return response['data']

def get_services():
    field = {
        "is_released": True,
    }
    update_field = {
        "status": "Nothing to retrieve",
    }
    service_types = [API_Services, Services, Product_Services]

    services_list = []

    for service_type in service_types:
        service_response = json.loads(dowellconnection(*service_type, "fetch", field, update_field))
        for service in service_response.get("data", []):
            service_data = {
                "ids": service.get("ids"),
                "is_active": service.get("is_active")
            }
            services_list.append(service_data)

    return services_list

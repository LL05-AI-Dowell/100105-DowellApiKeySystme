import json
import requests
from datetime import datetime, timedelta

def datacube_data_insertion(api_key,database_name,collection_name,data):

    url = "https://datacube.uxlivinglab.online/db_api/crud/"

    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "insert",
        "data":data
        
    }

    response = requests.post(url, json=data)
    return response.text

def datacube_data_retrival(api_key,database_name,collection_name,data,limit,offset,payment):

    url = "https://datacube.uxlivinglab.online/db_api/get_data/"

    data = {
        "api_key": api_key,
        "db_name": database_name,
        "coll_name": collection_name,
        "operation": "fetch",
        "filters":data,
        "limit": limit,
        "offset": offset,
        "payment":payment
    }

    response = requests.post(url, json=data)
    return response.text

def datacube_data_update(api_key,db_name,coll_name,query,update_data):

    url = "https://datacube.uxlivinglab.online/db_api/crud/"

    data = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_name": coll_name,
        "operation": "update",
        "query" : query,
        "update_data":update_data
    }

    response = requests.put(url, json=data)
    return response.text

def datacube_create_collection(api_key,db_name,collection_name):
    url = "https://datacube.uxlivinglab.online/db_api/add_collection/"

    data_to_add = {
        "api_key": api_key,
        "db_name": db_name,
        "coll_names": collection_name,
        "num_collections": 1
    }

    response = requests.post(url, json=data_to_add)
    return response.text

def datacube_collection_retrival(api_key,db_name):
    url = "https://datacube.uxlivinglab.online/db_api/collections/"
    payload = {
        "api_key": api_key,
        "db_name": db_name,
        "payment": False
    }
    response = requests.get(url, json=payload)
    return response.text


def get_dates(collection_data, date_type, date=None):
    parsed_dates = [date_str for date_str in collection_data]
    result = {
        "present_dates": [],
        "not_present_dates": []
    }
    
    if date_type == "one_day":
        if date:
            date_to_check = date + "_uxlivinglab_org"
            if date_to_check in parsed_dates:
                result["present_dates"].append(date_to_check)
            else:
                result["not_present_dates"].append(date_to_check)
    
    elif date_type == "seven_days":
        if date:
            seven_days_ago = [(datetime.strptime(date, "%d_%m_%Y") - timedelta(days=i)).strftime("%d_%m_%Y") + "_uxlivinglab_org" for i in range(7)]
            for d in seven_days_ago:
                if d in parsed_dates:
                    result["present_dates"].append(d)
                else:
                    result["not_present_dates"].append(d)
    
    elif date_type == "one_month":
        if date:
            one_month_ago = [(datetime.strptime(date, "%d_%m_%Y") - timedelta(days=i)).strftime("%d_%m_%Y") + "_uxlivinglab_org" for i in range(30)]
            for d in one_month_ago:
                if d in parsed_dates:
                    result["present_dates"].append(d)
                else:
                    result["not_present_dates"].append(d)
    
    return result
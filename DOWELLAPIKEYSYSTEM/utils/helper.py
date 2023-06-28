import uuid
import random
import json
import requests
from .constants import *

def generate_uuid():
    return str(uuid.uuid4())

def generate_voucher_code(number):
    digits = random_digits
    voucher = ""

    for _ in range(number):
        voucher += random.choice(digits)

    return voucher


def send_email(email, name, api_key, api_services):
    url = mail_api_url 
    payload = json.dumps({
        "email":email,
        "name":name,
        "api_key":api_key,
        "api_services": api_services
        })
    headers = {
        'Content-Type': 'application/json'
        }

    response = requests.request("POST", url, headers=headers, data=payload)
    res= json.loads(response.text)

    return res


def dowellconnection(cluster, database, collection, document, team_member_ID, function_ID, command, field,update_field):
    url = "http://uxlivinglab.pythonanywhere.com"
    payload = json.dumps({
        "cluster": cluster,
        "database": database,
        "collection": collection,
        "document": document,
        "team_member_ID": team_member_ID,
        "function_ID": function_ID,
        "command": command,
        "field": field,
        "update_field": update_field,
        "platform": "bangalore"
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    res = json.loads(response.text)

    return res


def get_event_id():
    url = "https://uxlivinglab.pythonanywhere.com/create_event"

    data = {
        "platformcode": "FB",
        "citycode": "101",
        "daycode": "0",
        "dbcode": "pfm",
        "ip_address": "192.168.0.41", 
        "login_id": "lav",  
        "session_id": "new",  
        "processcode": "1",
        "location": "22446576",  
        "objectcode": "1",
        "instancecode": "100051",
        "context": "afdafa ",
        "document_id": "3004",
        "rules": "some rules",
        "status": "work",
        "data_type": "learn",
        "purpose_of_usage": "add",
        "colour": "color value",
        "hashtags": "hash tag alue",
        "mentions": "mentions value",
        "emojis": "emojis",
        "bookmarks": "a book marks"
    }

    r = requests.post(url, json=data)
    if r.status_code == 201:
        return json.loads(r.text)
    else:
        return json.loads(r.text)['error']
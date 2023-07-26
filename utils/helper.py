import uuid
import random
import json
import requests

"""Generate UUID"""
def generate_uuid():
    return str(uuid.uuid4())

"""Generate code"""
def generate_code(number):
    digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    otp = ""

    for _ in range(number):
        otp += random.choice(digits)

    return otp

"""Dowell Mail API services"""
def send_email(email, name, api_key, api_services):
    url = "https://100085.pythonanywhere.com/api/send-api-key/"
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

"""Dowell Connection"""
def dowellconnection(cluster,database,collection,document,team_member_ID,function_ID,command,field,update_field):
    url = "http://uxlivinglab.pythonanywhere.com"
    # url = "http://100002.pythonanywhere.com/"
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
    res= json.loads(response.text)

    return res

import uuid
import random
import json
import requests
from utils.constant import *
import pytz
import datetime

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
def send_email(toname,toemail,subject,email_content):
    url = "https://100085.pythonanywhere.com/api/email/"
    print(toemail)
    payload = {
        "toname": toname,
        "toemail": toemail,
        "subject": subject,
        "email_content":email_content
    }
    response = requests.post(url, json=payload)
    return response.text

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

"""Generate voucher code"""
def generate_code(number):
    digits = "0123456789"
    code = ""

    for _ in range(number):
        code += random.choice(digits)

    return code

"""Generate voucher name"""
def generate_voucher_deatils(method_voucher, number):
    data = Method_Voucher
    if method_voucher in data:
        method_code = data[method_voucher]["code"]
        method_voucher_worth = data[method_voucher]["voucher_worth"]
        method_time = data[method_voucher]["time"]
        name = f"{method_code}-{generate_code(number)}-{generate_code(number)}-{generate_code(number)}"
        return {
            "name":name,
            "voucher_worth": method_voucher_worth,
            "time": method_time
        }
    else:
        return "Invalid method_voucher"
    
"""Dowell Mail API services"""
def dowell_time(timezone):
    url = "https://100009.pythonanywhere.com/dowellclock/"
    payload = json.dumps({
        "timezone":timezone,
        })
    headers = {
        'Content-Type': 'application/json'
        }

    response = requests.request("POST", url, headers=headers, data=payload)
    res= json.loads(response.text)

    return res

"""ALL PRODUCT DETAILS FROM LOGIN SERVER"""
def product_master():
    response = requests.get(product_url)
    return json.loads(response.text)

"""ALL PRODUCT DETAILS FROM SERVICE SERVER"""
def service_master():
    response = requests.get(service_url)
    return json.loads(response.text)
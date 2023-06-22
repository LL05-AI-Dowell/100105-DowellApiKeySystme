import uuid
import random
import json
import requests

def generate_uuid():
    return str(uuid.uuid4())

def generate_voucher_code(number):
    digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    otp = ""

    for _ in range(number):
        otp += random.choice(digits)

    return otp


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

    



















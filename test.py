from utils.helper import *
from utils.constant import *

field = {
    "name": []
}

update_field = {
    "disable_key": False
}

response = json.loads(dowellconnection(*Voucher_Services,"insert", field, update_field))

print("Response" , response)
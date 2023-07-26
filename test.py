from utils.constant import *
from utils.helper import *
from Service.helper import *

# def get_services():
#     field = {
#         "api_key": "1e33e5c6-68f8-4ace-98c9-c980a5f70f1e",
#     }
#     update_field = {
#         "status": "Nothing to retrieve",
#     }
#     response = json.loads(dowellconnection(*User_Services,"find", field, update_field))

#     service = get_services()

#     print(service)

#     return response["data"]["services"]

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

# Example usage:
print(get_services())


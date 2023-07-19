from service.models import *

def get_api_sevices():
    try:
        api_services = APISERVICES.objects.all()
        APISERVICES_LIST = []
        
        for api_service in api_services:
            api_service_dict = {
                'api_service_id': api_service.api_service_id,
                'name_service': api_service.name_service,
                'is_active': api_service.is_active,
                'is_released': api_service.is_released,
                'credits_count': api_service.credits_count,
            }
            APISERVICES_LIST.append(api_service_dict)
        return APISERVICES_LIST
    except:
        return "Something went wrong"

def get_modules():
    try:
        modules = MODULE.objects.all()
        MODULE_LIST = []

        for module in modules:
            module_dict ={
                "module_id": module.module_id,
                "module_name": module.name_module ,
                "module_type": module.module_type,
                "is_active": module.is_active,
                "is_released": module.is_released,
                "credits_count": module.credits_count,
                "api_service_ids": module.api_service_ids["ids"]
            }
            MODULE_LIST.append(module_dict)
        return MODULE_LIST
    except:
        return "something went wrong"
    
def get_products():
    try:
        products = PRODUCT.objects.all()
        PRODUCT_LIST = []

        for product in products:
            product_dict ={
                "product_id": product.product_id,
                "product_name": product.product_name,
                "credits_count": product.credits_count,
                "is_active": product.is_active,
                "is_released": product.is_released,
                "module_api_ids": product.types['ids']
            }
            PRODUCT_LIST.append(product_dict)
        
        return PRODUCT_LIST
    except:
        return "something went wrong"
    
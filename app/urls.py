from django.urls import path
from .views import *

urlpatterns = [
    path('service/',services.as_view()),
    path('voucher/',voucher.as_view()),
    path('user/',user_api_key.as_view()),
    path('service-update/',update_user_services.as_view()),
    path('process-services/',process_services.as_view()),
    path('add_name/',add_name.as_view()),
    
]
from django.urls import path
from .views import *

urlpatterns = [
    path('api-services/',add_api_services.as_view()),
    path('module/',add_module.as_view()),
    path('product/',add_product.as_view()),
]
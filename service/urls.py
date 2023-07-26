from django.urls import path
from .views import *

urlpatterns = [
    path('service/',services.as_view()),
    
]
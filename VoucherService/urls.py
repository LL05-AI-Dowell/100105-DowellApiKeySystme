from django.urls import path
from .views import *

urlpatterns = [
    path('voucher/',create_voucher.as_view()),
    
]
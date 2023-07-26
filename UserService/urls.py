from django.urls import path
from .views import *

urlpatterns = [
    path('user/',create_user_api_key.as_view()),
    path('user/test/',test.as_view()),
    
]
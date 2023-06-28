from django.urls import path
from .views import *

urlpatterns = [
    path('',apiservices.as_view())
]
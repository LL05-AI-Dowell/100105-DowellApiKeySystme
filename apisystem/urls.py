from django.urls import path
from .views import *

urlpatterns = [
    path('api-key/<str:userid>/',generateKey.as_view()),
]
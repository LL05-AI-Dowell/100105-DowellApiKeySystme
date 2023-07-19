from django.contrib import admin
from django.urls import path, include
from health_check import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',health_check.as_view()),
    path('api/v1/',(include('app.urls'))),
    path('api/v2/service/',(include('service.urls'))),
    path('api/v2/apisystem/',(include('apisystem.urls'))),
    path('api/v2/vouchersystem/',(include('vouchersystem.urls'))),
]

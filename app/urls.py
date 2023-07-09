from django.urls import path
from app.views import *

urlpatterns = [
    path('add-api-services/',DocumentDetails.as_view()),
    path('generate-voucher/',generateVoucher.as_view()),
    path('redeem-voucher/<str:userid>/',redeemVoucher.as_view()),
    path('generate-api-key/<str:userid>/',generateKey.as_view()),
    path('activate-api-services/<str:userid>/<str:apikey>/<str:api_service_id>/',ActivateService.as_view()),
    path('process-api-key/',processAPIKey.as_view()),
]
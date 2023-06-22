from django.urls import path
from app.views import *

urlpatterns = [
    path('generate-api-key/',generateKey.as_view()),
    path('generate-api-key/<str:workspaceId>/',generateKey.as_view()),
    path('process-api-key/',processapikey.as_view()),
    path('generate-voucher/',generateVoucher.as_view()),
    path('redeem-voucher/',redeemVoucher.as_view()),
    path('redeem-voucher/<str:email>/',redeemVoucher.as_view()),
    path('list-of-api/',documentdetails.as_view()),
]
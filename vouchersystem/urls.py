from django.urls import path
from app.views import *

urlpatterns = [
    path('generate-voucher/',generateVoucher.as_view()),
    path('redeem-voucher/<str:userid>/',redeemVoucher.as_view()),
]
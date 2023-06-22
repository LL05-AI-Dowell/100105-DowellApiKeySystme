from django.contrib import admin
from .models import ApiKey , Voucher , RedeemVoucher

admin.site.register(ApiKey)
admin.site.register(Voucher)
admin.site.register(RedeemVoucher)
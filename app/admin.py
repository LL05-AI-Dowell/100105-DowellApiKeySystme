from django.contrib import admin
from .models import ApiKey , Voucher , RedeemVoucher,Document

admin.site.register(ApiKey)
admin.site.register(Voucher)
admin.site.register(RedeemVoucher)
admin.site.register(Document)
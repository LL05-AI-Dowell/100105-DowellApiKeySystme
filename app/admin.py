from django.contrib import admin
from .models import ApiKey , Voucher , RedeemVoucher,Document,Component,Library,Flutterflow_component,Product

admin.site.register(ApiKey)
admin.site.register(Voucher)
admin.site.register(RedeemVoucher)
admin.site.register(Document)
admin.site.register(Component)
admin.site.register(Library)
admin.site.register(Flutterflow_component)
admin.site.register(Product)
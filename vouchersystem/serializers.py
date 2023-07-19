from rest_framework import serializers
from .models import *

class VoucherSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Voucher
        fields = '__all__'

class RedeemVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = RedeemVoucher
        fields = '__all__'

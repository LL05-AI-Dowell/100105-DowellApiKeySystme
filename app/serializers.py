from rest_framework import serializers
from .models import ApiKey, Voucher , RedeemVoucher

class ApiKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiKey
        fields = '__all__'
class ProcessAPIKeySerializer(serializers.Serializer):
    user_api_key = serializers.CharField(allow_null=False, allow_blank=False)
    user_api_services = serializers.CharField(allow_null=False, allow_blank=False)

class VoucherSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Voucher
        fields = '__all__'

class RedeemVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = RedeemVoucher
        fields = '__all__'
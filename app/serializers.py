from rest_framework import serializers
from .models import ApiKey, Voucher , RedeemVoucher,Document,Component,Library,Flutterflow_component,Product

class ApiKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiKey
        fields = '__all__'
class ProcessAPIKeySerializer(serializers.Serializer):
    user_api_key = serializers.CharField(allow_null=False, allow_blank=False)
    api_service_id = serializers.CharField(allow_null=False, allow_blank=False)

class VoucherSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Voucher
        fields = '__all__'

class RedeemVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = RedeemVoucher
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

        
class componentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Component
        fields = '__all__'
       
class librarySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Library
        fields = '__all__'


class Flutterflow_serializer(serializers.ModelSerializer):
    
    class Meta:
        model = Flutterflow_component
        fields = '__all__'



class Product_serializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
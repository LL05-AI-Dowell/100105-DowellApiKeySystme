from rest_framework import serializers
from .models import *

class APIServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = APISERVICES
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MODULE
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = PRODUCT
        fields = '__all__'

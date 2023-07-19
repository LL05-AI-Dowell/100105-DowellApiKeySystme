from rest_framework import serializers
from .models import *

class ApiKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKEY
        fields = '__all__'
class ProcessAPIKeySerializer(serializers.Serializer):
    user_api_key = serializers.CharField(allow_null=False, allow_blank=False)
    api_service_id = serializers.CharField(allow_null=False, allow_blank=False)
from rest_framework import serializers

class UserAPIKeySerializer(serializers.Serializer):
    username = serializers.CharField(allow_null=False, allow_blank=False)
    email = serializers.CharField(allow_null=False, allow_blank=False)
    userId = serializers.CharField(allow_null=False, allow_blank=False)
    userDetails = serializers.JSONField()
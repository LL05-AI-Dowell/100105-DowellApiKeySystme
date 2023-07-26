from rest_framework import serializers

class ApiServiceSerializer(serializers.Serializer):
    MODULE_CHOICES = (
        ('API', 'API'),
        ('PYTHON LIBRARY', 'PYTHON LIBARY'),
        ('R LIBRARY', 'R LIBARY'),
        ('WORDPRESS PLUGIN', 'WORDPRESS PLUGIN'),
        ('FLUTTER Component', 'FLUTTER COMPONENT'),
        ('REACT COMPONENT', 'Flutter COMPONENT'),
        ('PRODUCT', 'Product')
    )
    service_id = serializers.CharField(allow_null=False, allow_blank=False)
    service_type = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=MODULE_CHOICES)
    name = serializers.CharField(allow_null=False, allow_blank=False)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    link = serializers.CharField(allow_null=False, allow_blank=False)
    credits = serializers.CharField(allow_null=False, allow_blank=False)

class VoucherServiceSerializer(serializers.Serializer):
    name = serializers.CharField(allow_null=False, allow_blank=False)
    code = serializers.CharField(allow_null=False, allow_blank=False)
    discount = serializers.IntegerField()
    description = serializers.CharField(allow_null=False, allow_blank=False)

class UserAPIKeySerializer(serializers.Serializer):
    username = serializers.CharField(allow_null=False, allow_blank=False)
    email = serializers.CharField(allow_null=False, allow_blank=False)
    userId = serializers.CharField(allow_null=False, allow_blank=False)
    userDetails = serializers.JSONField()
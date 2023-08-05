from rest_framework import serializers

class ApiServiceSerializer(serializers.Serializer):
    MODULE_CHOICES = (
        ('API', 'API'),
        ('PYTHON LIBRARY', 'PYTHON LIBARY'),
        ('R LIBRARY', 'R LIBARY'),
        ('WORDPRESS PLUGIN', 'WORDPRESS PLUGIN'),
        ('FLUTTER COMPONENT', 'FLUTTER COMPONENT'),
        ('REACT COMPONENT', 'REACT COMPONENT'),
        ('PRODUCT', 'PRODUCT')
    )
    service_id = serializers.CharField(allow_null=False, allow_blank=False)
    service_type = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=MODULE_CHOICES)
    name = serializers.CharField(allow_null=False, allow_blank=False)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    link = serializers.CharField(allow_null=False, allow_blank=False)
    credits = serializers.CharField(allow_null=True, allow_blank=True)
    sub_service = serializers.ListField(child=serializers.JSONField())

class VoucherServiceSerializer(serializers.Serializer):
    name = serializers.CharField(allow_null=False, allow_blank=False)
    code = serializers.CharField(allow_null=False, allow_blank=False)
    discount = serializers.IntegerField()
    description = serializers.CharField(allow_null=False, allow_blank=False)

class UserAPIKeySerializer(serializers.Serializer):
    username = serializers.CharField(allow_null=False, allow_blank=False)
    email = serializers.CharField(allow_null=False, allow_blank=False)
    workspaceId = serializers.CharField(allow_null=False, allow_blank=False)
    userDetails = serializers.JSONField()

class ModuleSerializer(serializers.Serializer):
    service_ids = serializers.ListField(child=serializers.CharField(allow_null=False, allow_blank=False))
    module_id = serializers.CharField(allow_null=False, allow_blank=False)

class ProductSerializer(serializers.Serializer):
    service_id = serializers.CharField(allow_null=False, allow_blank=False)
    sub_service_ids = serializers.ListField(child=serializers.CharField(allow_null=False, allow_blank=False))

class UpgradeSerializer(serializers.Serializer):
    total_credits = serializers.IntegerField()

class SubServiceSerializer(serializers.Serializer):
    service_id = serializers.CharField(allow_null=False, allow_blank=False)
    sub_service = serializers.ListField(child=serializers.JSONField())
    description = serializers.CharField(allow_null=False, allow_blank=False)

class RestrictWorkspaceIdSerializer(serializers.Serializer):
    workspaceId = serializers.CharField(allow_null=False, allow_blank=False)
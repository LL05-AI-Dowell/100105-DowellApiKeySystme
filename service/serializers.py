from rest_framework import serializers

class ApiServiceSerializer(serializers.Serializer):
    ids = serializers.CharField(allow_null=False, allow_blank=False)
    name = serializers.CharField(allow_null=False, allow_blank=False)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    link = serializers.CharField(allow_null=False, allow_blank=False)
    credits = serializers.CharField(allow_null=False, allow_blank=False)

class ModuleServiceSerializer(serializers.Serializer):
    MODULE_CHOICES = (
        ('WordPress Plugin', 'WordPress Plugin'),
        ('React Component', 'React Component'),
        ('Flutter Component', 'Flutter Component'),
        ('Library', 'Library'),
    )
    ids = serializers.CharField(allow_null=False, allow_blank=False)
    name = serializers.CharField(allow_null=False, allow_blank=False)
    module_type = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=MODULE_CHOICES)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    link = serializers.CharField(allow_null=False, allow_blank=False)
    credits = serializers.CharField(allow_null=False, allow_blank=False)
    api_service_ids = serializers.ListField(child=serializers.CharField(allow_null=False, allow_blank=False))

class ProductServiceSerializer(serializers.Serializer):
    ids = serializers.CharField(allow_null=False, allow_blank=False)
    name = serializers.CharField(allow_null=False, allow_blank=False)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    link = serializers.CharField(allow_null=False, allow_blank=False)
    credits = serializers.CharField(allow_null=False, allow_blank=False)
    service_ids = serializers.ListField(child=serializers.CharField(allow_null=False, allow_blank=False))
from rest_framework import serializers

class VoucherServiceSerializer(serializers.Serializer):
    name = serializers.CharField(allow_null=False, allow_blank=False)
    code = serializers.CharField(allow_null=False, allow_blank=False)
    discount = serializers.IntegerField()
    description = serializers.CharField(allow_null=False, allow_blank=False)
    
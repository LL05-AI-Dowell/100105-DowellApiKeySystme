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
    sub_service_ids = serializers.ListField(child=serializers.CharField(allow_null=False, allow_blank=False))
    service_id = serializers.CharField(allow_null=False, allow_blank=False)

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

class ClaimMethodSerializer(serializers.Serializer):
    METHOD_CHOICES = (
        ("DIRECT FROM DOWELLPAY", "DIRECT FROM DOWELLPAY"),
        ('STORE MARKETPLACE', 'STORES MARKETPLACE'),
        ('SALES AGENTS BOOKING COUPONS', 'SALES AGENTS BOOKING COUPONS'),
        ('REFERENCES CREDIT COUPONS', 'REFERENCES CREDIT COUPONS'),
        ('ACTIVITY CREDIT COUPONS', 'ACTIVITY CREDIT COUPONS'),
        ('DOWNLOADS - GOOGLEPLAY/APPLE STORE', 'DOWNLOADS - GOOGLEPLAY/APPLE STORE'),
        ('PUBLIC REVIEW CREDITS COUPONS', 'PUBLIC REVIEW CREDITS COUPONS'),
        ('SIGNUP CREDITS', 'SIGNUP CREDITS'),
        ('STARTUP CREDIT COUPONS', 'STARTUP CREDIT COUPONS'),
        ('INTERNAL CREDIT COUPONS', 'INTERNAL CREDIT COUPONS'),
        ('TOPUPS CREDITS', 'TOPUPS CREDITS'),
        ('TEAM MANAGEMENT CREDITS','TEAM MANAGEMENT CREDITS')
    )
    email =  serializers.CharField(allow_null=True, allow_blank=True)
    claim_method = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=METHOD_CHOICES)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    timezone = serializers.CharField(allow_null=False, allow_blank=False)

class RedeemMethodSerializer(serializers.Serializer):
    workspace_id = serializers.CharField(allow_null=False, allow_blank=False)
    voucher_code = serializers.CharField(allow_null=False, allow_blank=False)
    timezone = serializers.CharField(allow_null=False, allow_blank=False)

class PublicVoucherSerializer(serializers.Serializer):
    timezone = serializers.CharField(allow_null=False, allow_blank=False)
    description = serializers.CharField(allow_null=False, allow_blank=False)
    credit = serializers.IntegerField()

class PublicTopupSerializer(serializers.Serializer):
    voucher_code = serializers.CharField(allow_null=False, allow_blank=False)
    workspace_id = serializers.CharField(allow_null=False, allow_blank=False)

class UpdateServicesSerializer(serializers.Serializer):
    MODULE_CHOICES = (
        ('API', 'API'),
        ('PYTHON LIBRARY', 'PYTHON LIBARY'),
        ('R LIBRARY', 'R LIBARY'),
        ('WORDPRESS PLUGIN', 'WORDPRESS PLUGIN'),
        ('FLUTTER COMPONENT', 'FLUTTER COMPONENT'),
        ('REACT COMPONENT', 'REACT COMPONENT'),
        ('PRODUCT', 'PRODUCT')
    )
    action = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=MODULE_CHOICES)
    document_id = serializers.CharField(allow_null=False, allow_blank=False)


class ExperiencedProductSerializer(serializers.Serializer):
    METHOD_CHOICES = (
        ("SAMANTA CONTENT EVALUATOR", "SAMANTA CONTENT EVALUATOR"),
        ('WORLD PRICE INDICATOR', 'WORLD PRICE INDICATOR'),
        ('LEGALZARD', 'LEGALZARD'),
        ('LOCATION SPECIFIC SEARCH', 'LOCATION SPECIFIC SEARCH'),
        ('WEBSITE CRAWL', 'WEBSITE CRAWL'),
        ('SEARCH IN LIVINGLAB', 'SEARCH IN LIVINGLAB'),
    )
    product_name = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=METHOD_CHOICES)
    email = serializers.CharField(allow_null=False, allow_blank=False)
    experienced_data =  serializers.JSONField()

class ExperiencedUserDetailsSerializer(serializers.Serializer):
    METHOD_CHOICES = (
        ("UXLIVINGLAB001", "UXLIVINGLAB001"),
        ('UXLIVINGLAB002', 'UXLIVINGLAB002'),
        ('UXLIVINGLAB003', 'UXLIVINGLAB003'),
        ('UXLIVINGLAB004', 'UXLIVINGLAB004'),
        ('UXLIVINGLAB005', 'UXLIVINGLAB005'),
        ('UXLIVINGLAB006', 'UXLIVINGLAB006'),
    )
    product_number = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=METHOD_CHOICES)
    email = serializers.CharField(allow_null=False, allow_blank=False)
class ReduceExperiencedSerializer(serializers.Serializer):
    METHOD_CHOICES = (
        ("UXLIVINGLAB001", "UXLIVINGLAB001"),
        ('UXLIVINGLAB002', 'UXLIVINGLAB002'),
        ('UXLIVINGLAB003', 'UXLIVINGLAB003'),
        ('UXLIVINGLAB004', 'UXLIVINGLAB004'),
        ('UXLIVINGLAB005', 'UXLIVINGLAB005'),
        ('UXLIVINGLAB006', 'UXLIVINGLAB006'),
    )
    product_number = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=METHOD_CHOICES)
    email = serializers.CharField(allow_null=False, allow_blank=False)
    occurrences = serializers.IntegerField()

class GenerateCouponSerializer(serializers.Serializer):
    number_of_coupons = serializers.IntegerField()

class UseCouponSerializer(serializers.Serializer):
    METHOD_CHOICES = (
        ("UXLIVINGLAB001", "UXLIVINGLAB001"),
        ('UXLIVINGLAB002', 'UXLIVINGLAB002'),
        ('UXLIVINGLAB003', 'UXLIVINGLAB003'),
        ('UXLIVINGLAB004', 'UXLIVINGLAB004'),
        ('UXLIVINGLAB005', 'UXLIVINGLAB005'),
        ('UXLIVINGLAB006', 'UXLIVINGLAB006'),
    )
    product_number = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=METHOD_CHOICES)
    email = serializers.CharField(allow_null=False, allow_blank=False)
    coupon = serializers.CharField(allow_null=False, allow_blank=False)

class ReportUserExperiencedCountSerializer(serializers.Serializer):
    DATE_TYPE_CHOICES = (
        ("one_day", "one_day"),
        ('seven_days', 'seven_days'),
        ('one_month', 'one_month')
    )
    METHOD_CHOICES = (
        ("UXLIVINGLAB001", "UXLIVINGLAB001"),
        ('UXLIVINGLAB002', 'UXLIVINGLAB002'),
        ('UXLIVINGLAB003', 'UXLIVINGLAB003'),
        ('UXLIVINGLAB004', 'UXLIVINGLAB004'),
        ('UXLIVINGLAB005', 'UXLIVINGLAB005'),
        ('UXLIVINGLAB006', 'UXLIVINGLAB006'),
    )
    product_number = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=METHOD_CHOICES)
    time_period = serializers.ChoiceField(allow_null=False, allow_blank=False, choices=DATE_TYPE_CHOICES)
    date = serializers.CharField(allow_null=False, allow_blank=False)
    email = serializers.CharField(allow_null=True, allow_blank=True)
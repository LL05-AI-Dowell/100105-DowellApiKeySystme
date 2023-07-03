from django.db import models

class ApiKey(models.Model):
    
    APIKey = models.CharField(max_length=255, unique=True)
    email = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    credits = models.IntegerField(blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    userDetails = models.JSONField(null=True, blank=False)
    api_services = models.ForeignKey('Document', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return str(self.APIKey)
    class Meta:
        unique_together = ("APIKey","email")

class Voucher(models.Model):
    voucher_name = models.CharField(max_length=255,unique=True)
    voucher_code = models.CharField(max_length=255,unique=True)
    voucher_discount = models.IntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.voucher_name)
    
class RedeemVoucher(models.Model):
    email = models.CharField(max_length=255,unique=True)
    name = models.CharField(max_length=255,unique=True)
    voucher_code = models.CharField(max_length=255)

    def __str__(self):
        return str(self.name)
    

class Document(models.Model):
    api_service = models.CharField(max_length=255)
    document_link = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    is_released = models.BooleanField(default=True)
    credits_count = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return str(self.api_service)
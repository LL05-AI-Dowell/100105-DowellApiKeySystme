from django.db import models
import json

class ApiKey(models.Model):
    
    APIKey = models.CharField(max_length=255, unique=True)
    email = models.CharField(max_length=255)
    userId = models.CharField(max_length=255,null=True,unique=True)
    is_active = models.BooleanField(default=False)
    credits = models.IntegerField(blank=True, null=True)
    total_credits = models.IntegerField(blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    userDetails = models.JSONField(null=True, blank=False)
    api_services = models.JSONField(null=True, blank=False)
    is_redeemed = models.BooleanField(default=False)
    Component =models.JSONField(null=True, blank=False)
    Library=models.JSONField(null=True, blank=False)
    Product=models.JSONField(null=True, blank=False)
    

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
    userId = models.CharField(max_length=255,unique=True, default=False)
    email = models.CharField(max_length=255,unique=True)
    name = models.CharField(max_length=255,unique=True)
    voucher_code = models.CharField(max_length=255)

    def __str__(self):
        return str(self.name)
    

class Document(models.Model):
    api_service_id = models.CharField(max_length=255, unique=True)
    api_service = models.CharField(max_length=255)
    document_link = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    is_released = models.BooleanField(default=True)
    credits_count = models.IntegerField(null=False)

    def __str__(self):
        return str(self.api_service)
    

class Component(models.Model):
    name=models.CharField(max_length=225,unique=True)
    apiservices=models.JSONField(null=True,blank=True)
    credit_count=models.IntegerField(blank=True, null=True)
    total_count=models.IntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=False)
    is_released = models.BooleanField(default=True)
    def __str__(self):
        return str(self.name)
    
class Library(models.Model):
    library_id=models.CharField(max_length=225,blank=True)
    name=models.CharField(max_length=225,unique=True)
    components=models.JSONField(null=True,blank=True)
    credit_count=models.CharField(max_length=225,blank=True)
    total_credit_count=models.IntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=False)
    is_released = models.BooleanField(default=True)
    def __str__(self):
        return str(self.name)
    

class Flutterflow(models.Model):
    name=models.CharField(max_length=225,unique=True,default="test")
    id=models.IntegerField(blank=True, null=False,primary_key=True)
    libraries=models.JSONField(null=True,blank=True) 
    total_credit_count=models.IntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=False)
    is_released = models.BooleanField(default=True)
    def __str__(self):
        return str(self.name)
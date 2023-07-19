from django.db import models
import json

# Create your models here.
class APISERVICES(models.Model):
    api_service_id = models.CharField(max_length=255, unique=True)
    name_service = models.CharField(max_length=255)
    document_link = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    is_released = models.BooleanField(default=True)
    credits_count = models.IntegerField(null=False)

    def __str__(self):
        return str(self.name_service)

class MODULE(models.Model):
    MODULE_CHOICES = (
        ('WordPress Plugin', 'WordPress Plugin'),
        ('React Component', 'React Component'),
        ('Flutter Component', 'Flutter Component'),
        ('Library', 'Library'),
    )
    
    module_type = models.CharField(max_length=50, choices=MODULE_CHOICES)
    module_id = models.CharField(max_length=255, unique=True)
    name_module = models.CharField(max_length=255)
    document_link = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)
    is_released = models.BooleanField(default=True)
    credits_count = models.IntegerField(null=False)
    api_service_ids = models.JSONField(null=True ,blank=False)

    def __str__(self):
        return str(self.name_module)
    
class PRODUCT(models.Model):
    product_id=models.CharField(max_length=225,unique=True)
    product_name=models.CharField(max_length=225,unique=True)
    product_link = models.CharField(null=True,max_length=255)
    is_active = models.BooleanField(default=False)
    is_released = models.BooleanField(default=True)
    credits_count=models.IntegerField(blank=True, null=True)
    types = models.JSONField(null=True ,blank=False)
    
    def __str__(self):
        return str(self.product_name)
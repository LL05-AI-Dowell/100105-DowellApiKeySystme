from django.db import models

class APIKEY(models.Model):
    
    APIKey = models.CharField(max_length=255, unique=True)
    email = models.CharField(max_length=255)
    userId = models.CharField(max_length=255,null=True,unique=True)
    is_active = models.BooleanField(default=False)
    credits = models.IntegerField(blank=True, null=True)
    total_credits = models.IntegerField(blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    userDetails = models.JSONField(null=True, blank=False)
    api_services = models.JSONField(null=True, blank=False)
    modules = models.JSONField(null=True, blank=False)
    products = models.JSONField(null=True, blank=False)
    is_redeemed = models.BooleanField(default=False)

    def __str__(self):
        return str(self.APIKey)
    class Meta:
        unique_together = ("APIKey","email")
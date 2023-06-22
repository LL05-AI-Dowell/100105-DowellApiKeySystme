from django.db import models

class ApiKey(models.Model):
    API_SERVICES_CHOICES = (
        ('Living Lab scale', 'Living Lab scale'),
        ('Living Lab Chat', 'Living Lab Chat'),
        ('DoWell Open Source License Compatibility check', 'DoWell Open Source License Compatibility check'),
        ('UX Live', 'UX Live'),
        ('Statistical distributions from bigdata', 'Statistical distributions from bigdata'),
        ('Dowell Payments', 'Dowell Payments'),
        ('Dowell QR Code Generator', 'Dowell QR Code Generator'),
        ('Dowell Email', 'Dowell Email'),
        ('DoWell Sampling from big data', 'DoWell Sampling from big data'),
        ('DoWell Permutations', 'DoWell Permutations'),
        ('DoWell Shuffling of Big data', 'DoWell Shuffling of Big data'),
        ('DoWell Wifi QR Code', 'DoWell Wifi QR Code'),
        ('Living lab Maps', 'Living lab Maps'),
        ('DoWell Secure repositories', 'DoWell Secure repositories'),
        ('DoWell Geometrical layout of Big Data', 'DoWell Geometrical layout of Big Data'),
        ('DoWell Central tendencies of Big data distributions', 'DoWell Central tendencies of Big data distributions'),
        ('DoWell Subscribe NewsLetter', 'DoWell Subscribe Newsletter'),
        ('DoWell Topic Generation','DoWell Topic Generation'),
        ('DoWell Coordinates','DoWell Coordinates')

    )
    APIKey = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    api_services = models.CharField(max_length=255, choices=API_SERVICES_CHOICES, unique=True)
    is_active = models.BooleanField(default=True)
    credits = models.IntegerField(blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    workspace_id = models.CharField(max_length=255,null=True)
    userDetails = models.JSONField(null=True, blank=False)

    def __str__(self):
        return str(self.APIKey)

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
    voucher_code = models.CharField(max_length=255,unique=True)

    def __str__(self):
        return str(self.name)
    






# Generated by Django 4.2.2 on 2023-06-26 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_alter_redeemvoucher_voucher_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apikey',
            name='api_services',
            field=models.CharField(choices=[('Living Lab scale', 'Living Lab scale'), ('Living Lab Chat', 'Living Lab Chat'), ('DoWell Open Source License Compatibility check', 'DoWell Open Source License Compatibility check'), ('UX Live', 'UX Live'), ('Statistical distributions from bigdata', 'Statistical distributions from bigdata'), ('Dowell Payments', 'Dowell Payments'), ('Dowell QR Code Generator', 'Dowell QR Code Generator'), ('Dowell Email', 'Dowell Email'), ('DoWell Sampling from big data', 'DoWell Sampling from big data'), ('DoWell Permutations', 'DoWell Permutations'), ('DoWell Shuffling of Big data', 'DoWell Shuffling of Big data'), ('DoWell Wifi QR Code', 'DoWell Wifi QR Code'), ('Living lab Maps', 'Living lab Maps'), ('DoWell Secure repositories', 'DoWell Secure repositories'), ('DoWell Geometrical layout of Big Data', 'DoWell Geometrical layout of Big Data'), ('DoWell Central tendencies of Big data distributions', 'DoWell Central tendencies of Big data distributions'), ('DoWell Subscribe NewsLetter', 'DoWell Subscribe Newsletter'), ('DoWell Topic Generation', 'DoWell Topic Generation'), ('DoWell Coordinates', 'DoWell Coordinates'), ('DoWell Login', 'DoWell Login')], max_length=255, unique=True),
        ),
    ]

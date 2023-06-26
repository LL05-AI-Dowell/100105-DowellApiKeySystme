# Generated by Django 4.2.2 on 2023-06-26 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RedeemVoucher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255, unique=True)),
                ('voucher_code', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Voucher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('voucher_name', models.CharField(max_length=255, unique=True)),
                ('voucher_code', models.CharField(max_length=255, unique=True)),
                ('voucher_discount', models.IntegerField()),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='ApiKey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('APIKey', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
                ('api_services', models.CharField(choices=[('Living Lab scale', 'Living Lab scale'), ('Living Lab Chat', 'Living Lab Chat'), ('DoWell Open Source License Compatibility check', 'DoWell Open Source License Compatibility check'), ('UX Live', 'UX Live'), ('Statistical distributions from bigdata', 'Statistical distributions from bigdata'), ('Dowell Payments', 'Dowell Payments'), ('Dowell QR Code Generator', 'Dowell QR Code Generator'), ('Dowell Email', 'Dowell Email'), ('DoWell Sampling from big data', 'DoWell Sampling from big data'), ('DoWell Permutations', 'DoWell Permutations'), ('DoWell Shuffling of Big data', 'DoWell Shuffling of Big data'), ('DoWell Wifi QR Code', 'DoWell Wifi QR Code'), ('Living lab Maps', 'Living lab Maps'), ('DoWell Secure repositories', 'DoWell Secure repositories'), ('DoWell Geometrical layout of Big Data', 'DoWell Geometrical layout of Big Data'), ('DoWell Central tendencies of Big data distributions', 'DoWell Central tendencies of Big data distributions'), ('DoWell Subscribe NewsLetter', 'DoWell Subscribe Newsletter'), ('DoWell Topic Generation', 'DoWell Topic Generation'), ('DoWell Coordinates', 'DoWell Coordinates'), ('DoWell Login', 'DoWell Login')], max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('credits', models.IntegerField(blank=True, null=True)),
                ('is_paid', models.BooleanField(default=False)),
                ('workspace_id', models.CharField(max_length=255, null=True)),
                ('userDetails', models.JSONField(null=True)),
            ],
            options={
                'unique_together': {('workspace_id', 'api_services')},
            },
        ),
    ]

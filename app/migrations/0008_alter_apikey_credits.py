# Generated by Django 4.2.2 on 2023-06-22 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_alter_apikey_api_services'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apikey',
            name='credits',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]

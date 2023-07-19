# Generated by Django 4.2.2 on 2023-07-19 23:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ApiKey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('APIKey', models.CharField(max_length=255, unique=True)),
                ('email', models.CharField(max_length=255)),
                ('userId', models.CharField(max_length=255, null=True, unique=True)),
                ('is_active', models.BooleanField(default=False)),
                ('credits', models.IntegerField(blank=True, null=True)),
                ('total_credits', models.IntegerField(blank=True, null=True)),
                ('is_paid', models.BooleanField(default=False)),
                ('userDetails', models.JSONField(null=True)),
                ('api_services', models.JSONField(null=True)),
                ('modules', models.JSONField(null=True)),
                ('products', models.JSONField(null=True)),
                ('is_redeemed', models.BooleanField(default=False)),
            ],
            options={
                'unique_together': {('APIKey', 'email')},
            },
        ),
    ]

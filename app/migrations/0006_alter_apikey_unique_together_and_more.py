# Generated by Django 4.2.2 on 2023-07-03 01:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_rename_email_apikey_userid_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='apikey',
            unique_together={('APIKey', 'userId')},
        ),
        migrations.RemoveField(
            model_name='apikey',
            name='workspace_id',
        ),
    ]

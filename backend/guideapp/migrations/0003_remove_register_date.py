# Generated by Django 4.1.5 on 2023-08-20 19:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('guideapp', '0002_alter_register_phone1_alter_register_phone2'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='register',
            name='date',
        ),
    ]

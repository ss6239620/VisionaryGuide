# Generated by Django 4.1.5 on 2023-08-20 11:37

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Register',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.IntegerField()),
                ('username', models.TextField()),
                ('email', models.EmailField(max_length=254)),
                ('phone1', models.IntegerField(max_length=10)),
                ('phone2', models.IntegerField(max_length=10)),
                ('date', models.DateField(default=datetime.datetime.now)),
            ],
        ),
    ]

# Generated by Django 3.2.4 on 2021-06-30 01:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("pins", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="pin",
            name="image",
        ),
    ]
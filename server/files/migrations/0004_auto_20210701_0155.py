# Generated by Django 3.2.4 on 2021-07-01 01:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("files", "0003_auto_20210701_0144"),
    ]

    operations = [
        migrations.AlterField(
            model_name="image",
            name="height",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name="image",
            name="width",
            field=models.PositiveIntegerField(default=0),
        ),
    ]

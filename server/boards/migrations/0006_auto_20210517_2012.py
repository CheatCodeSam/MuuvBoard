# Generated by Django 3.2.3 on 2021-05-17 20:12

import datetime

import django.utils.timezone
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ("boards", "0005_auto_20210516_2347"),
    ]

    operations = [
        migrations.AddField(
            model_name="board",
            name="created",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="board",
            name="updated",
            field=models.DateTimeField(
                default=datetime.datetime(2021, 5, 17, 20, 12, 53, 509582, tzinfo=utc)
            ),
            preserve_default=False,
        ),
    ]

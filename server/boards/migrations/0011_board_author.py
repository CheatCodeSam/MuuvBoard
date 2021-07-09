# Generated by Django 3.2.5 on 2021-07-08 02:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("boards", "0010_delete_pin"),
    ]

    operations = [
        migrations.AddField(
            model_name="board",
            name="author",
            field=models.ForeignKey(
                default=1, on_delete=django.db.models.deletion.CASCADE, to="users.user"
            ),
            preserve_default=False,
        ),
    ]
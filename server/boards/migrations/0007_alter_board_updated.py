# Generated by Django 3.2.3 on 2021-05-17 20:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("boards", "0006_auto_20210517_2012"),
    ]

    operations = [
        migrations.AlterField(
            model_name="board",
            name="updated",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
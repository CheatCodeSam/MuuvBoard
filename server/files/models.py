from django.db import models

from pins.models import Pin


class Image(models.Model):
    pin = models.ForeignKey(
        Pin, on_delete=models.CASCADE, related_name="images", null=True
    )

    image = models.ImageField(upload_to="images/", null=True)

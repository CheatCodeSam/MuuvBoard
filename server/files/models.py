from io import BytesIO

from django.core.files.base import ContentFile
from django.db import models
from PIL import Image as PImg

from pins.models import Pin


class Image(models.Model):
    pin = models.ForeignKey(
        Pin,
        on_delete=models.CASCADE,
        related_name="images",
        null=True,
        blank=True,
    )

    height = models.PositiveIntegerField(default=0)
    width = models.PositiveIntegerField(default=0)

    image = models.ImageField(upload_to="images/", null=True)

    def save(self, *args, **kwargs):

        if self.image:
            filename = "%s.png" % self.image.name.split(".")[0]
            image = PImg.open(self.image)
            image_io = BytesIO()
            image.save(image_io, format="PNG", quality=100)

            w = image.width
            h = image.height

            self.width = w
            self.height = h
            self.image.save(filename, ContentFile(image_io.getvalue()), save=False)

        super(Image, self).save(*args, **kwargs)

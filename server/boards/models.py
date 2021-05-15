from django.db import models
from taggit.managers import TaggableManager

from muuvboard.settings import AUTH_USER_MODEL


class Pin(models.Model):
    title = models.CharField(max_length=100, blank=True)
    tags = TaggableManager()

    author = models.ForeignKey(
        AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="pins"
    )

    x_coordinate = models.IntegerField()
    y_coordinate = models.IntegerField()

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

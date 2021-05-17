from django.db import models
from taggit.managers import TaggableManager


class Board(models.Model):
    title = models.CharField(max_length=100, blank=False, null=True)


class Pin(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)
    tags = TaggableManager()

    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="pins")

    x_coordinate = models.IntegerField(default=0)
    y_coordinate = models.IntegerField(default=0)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Image(models.Model):
    filename = models.CharField(max_length=255, blank=False)
    mimetype = models.CharField(max_length=30, blank=False)

    pin = models.ForeignKey(Pin, related_name="images", on_delete=models.DO_NOTHING)

    image = models.ImageField(upload_to="images/")
    # Thumbnails Later

    created = models.DateTimeField(auto_now_add=True)

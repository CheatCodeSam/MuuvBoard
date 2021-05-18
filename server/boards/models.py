from django.db import models
from taggit.managers import TaggableManager


class Board(models.Model):
    title = models.CharField(max_length=100, blank=False, null=False, unique=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)


class Pin(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)
    tags = TaggableManager(blank=True)

    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="pins")

    image = models.ImageField(upload_to="images/", null=True)

    x_coordinate = models.IntegerField(default=0)
    y_coordinate = models.IntegerField(default=0)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

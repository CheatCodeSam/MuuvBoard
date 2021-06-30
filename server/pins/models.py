from django.db import models
from taggit.managers import TaggableManager

from boards.models import Board


class Pin(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)
    tags = TaggableManager(blank=True)

    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="pins")

    x_coordinate = models.IntegerField(default=0)
    y_coordinate = models.IntegerField(default=0)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

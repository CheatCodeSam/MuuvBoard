from django.contrib.auth import get_user_model
from django.db import models
from taggit.managers import TaggableManager

from boards.models import Board


class Pin(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    title = models.CharField(max_length=100, blank=True, null=True)
    tags = TaggableManager(blank=True)

    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name="pins")

    x_coordinate = models.IntegerField(default=0)
    y_coordinate = models.IntegerField(default=0)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.title:
            return f"{self.title} - id: {self.id} - Board {self.board}"
        else:
            return f"NULL - id: {self.id} - Board {self.board}"

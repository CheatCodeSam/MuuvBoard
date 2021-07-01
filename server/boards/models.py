from django.db import models
from taggit.managers import TaggableManager


class Board(models.Model):
    title = models.CharField(max_length=100, blank=False, null=False, unique=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

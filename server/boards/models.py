from django.contrib.auth import get_user_model
from django.db import models


class Board(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    title = models.CharField(max_length=100, blank=False, null=False, unique=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

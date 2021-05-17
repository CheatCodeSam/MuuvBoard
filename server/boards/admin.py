from django.contrib import admin

from .models import Board, Pin


@admin.register(Pin)
class PinAdmin(admin.ModelAdmin):
    pass


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    pass

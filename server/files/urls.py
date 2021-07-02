from django.urls import path

from . import views

urlpatterns = [
    path("api/files/", views.ImageDetail.as_view()),
]

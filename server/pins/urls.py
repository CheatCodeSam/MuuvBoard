from django.urls import path

from . import views

urlpatterns = [
    path("api/pins/", views.PinList.as_view()),
    path("api/pins/<int:pk>/", views.PinDetail.as_view()),
]

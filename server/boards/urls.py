from django.urls import path

from . import views

urlpatterns = [
    path("api/boards/", views.BoardList.as_view()),
    path("api/boards/<int:pk>/", views.BoardDetail.as_view()),
    path("api/boards/<int:pk>/pins/", views.BoardWithPinsDetail.as_view()),
]

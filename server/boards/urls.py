from django.urls import path

from . import views

urlpatterns = [
    path("api/boards/", views.BoardList.as_view()),
    # path("api/boards/<int:pk>/", MovieDetail.as_view()),
]

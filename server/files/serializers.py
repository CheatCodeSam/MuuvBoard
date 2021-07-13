from easy_thumbnails.files import get_thumbnailer
from rest_framework import serializers

from .models import Image


class ImageDetailSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ["image", "id", "width", "height", "thumbnail"]
        read_only_fields = ["id", "width", "height", "thumbnail"]

    # TODO make sure this isnt hardcoded in the future.
    # TODO force thumbnails to be jpg
    def get_thumbnail(self, obj):
        return (
            "http://localhost:8003" + get_thumbnailer(obj.image)["medium_thumbnail"].url
        )

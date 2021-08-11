from math import ceil

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
        ratio = 1
        new_height = 120
        new_width = 120
        if obj.image.width > obj.image.height:
            ratio = obj.image.width / obj.image.height
            new_width = ceil(new_width * ratio)
        elif obj.image.height > obj.image.width:
            ratio = obj.image.height / obj.image.width
            new_height = ceil(new_height * ratio)
        else:
            pass
        print(str(new_height) + ", " + str(new_width))

        options = {"size": (new_width, new_height), "crop": True}
        return (
            "http://localhost:8003"
            + get_thumbnailer(obj.image).get_thumbnail(options).url
        )

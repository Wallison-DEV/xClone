from django.contrib import admin
from .models import PostModel, CommentModel, RetweetModel

admin.site.register(PostModel)
admin.site.register(CommentModel)
admin.site.register(RetweetModel)
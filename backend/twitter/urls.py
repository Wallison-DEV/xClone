from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from accounts.views import AccountModelViewSet
from tweets.views import PostViewSet, CommentViewSet, RetweetViewSet, CombinedPostViewSet

router = DefaultRouter()
router.register(r'users', AccountModelViewSet, basename='user')
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'retweet', RetweetViewSet, basename='retweet')
router.register(r'combined', CombinedPostViewSet, basename='combined')

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', include(router.urls)),
    path("", include('accounts.urls')),
    path("", include('tweets.urls')),
    path('accounts/', include('allauth.urls')),
] 

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

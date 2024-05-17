from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PostViewSet, CommentViewSet, RetweetViewSet, CombinedPostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'retweet', RetweetViewSet, basename='retweet')
router.register(r'combined', CombinedPostViewSet, basename='combined')

urlpatterns = [
    path('', include(router.urls)),
    path('followed-feed/', CombinedPostViewSet.as_view({'get': 'followed_feed'}), name='followed-feed'),
    path('suggested-feed/', CombinedPostViewSet.as_view({'get': 'suggested_feed'}), name='suggested-feed'),
    path('user-feed/<int:user_id>/', CombinedPostViewSet.as_view({'get': 'user_feed'}), name='user-feed'),
    path('create-post/', PostViewSet.as_view({'post': 'create'}), name='create-post'),
    path('create-retweet/', RetweetViewSet.as_view({'post': 'create'}), name='create-retweet'),
    path('post/<int:pk>/add-like/', PostViewSet.as_view({'post': 'add_like'}), name='post-add-like'),
    path('retweet/<int:pk>/add-like/', RetweetViewSet.as_view({'post': 'add_like'}), name='post-add-like'),
]
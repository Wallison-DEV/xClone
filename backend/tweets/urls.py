from django.urls import path

from .views import PostViewSet, RetweetViewSet, CombinedPostViewSet

urlpatterns = [
    path('followed-feed/', CombinedPostViewSet.as_view({'get': 'followed_feed'}), name='followed-feed'),
    path('suggested-feed/', CombinedPostViewSet.as_view({'get': 'suggested_feed'}), name='suggested-feed'),
    path('user-feed/<int:user_id>/', CombinedPostViewSet.as_view({'get': 'user_feed'}), name='user-feed'),
    path('create-post/', PostViewSet.as_view({'post': 'create'}), name='create-post'),
    path('create-retweet/', RetweetViewSet.as_view({'post': 'create'}), name='create-retweet'),
    path('post/<int:pk>/add-like/', PostViewSet.as_view({'post': 'add_like'}), name='post-add-like'),
    path('retweet/<int:pk>/add-like/', RetweetViewSet.as_view({'post': 'add_like'}), name='post-add-like'),
    path('update-tweet/', PostViewSet.as_view({'patch': 'update_tweet'}), name='update-tweet'),
    path('update-retweet/', RetweetViewSet.as_view({'patch': 'update_retweet'}), name='update-retweet'),
]
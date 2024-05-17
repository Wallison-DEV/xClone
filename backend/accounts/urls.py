from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from .views import AccountModelViewSet, CustomTokenObtainPairView, TokenValidateView

router = DefaultRouter()
router.register('users', AccountModelViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/validate/', TokenValidateView.as_view(), name='token_validate'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', TokenBlacklistView.as_view(), name='logout'),
    path('my-user/', AccountModelViewSet.as_view({'get': 'my_user'}), name='dados_usuario'),
    path('other-unfollowed-users/', AccountModelViewSet.as_view({'get': 'other_unfollowed_users'}), name='other_unfollowed-users'),
    path('users/<int:pk>/follow/', AccountModelViewSet.as_view({'post': 'follow'}), name='follow_user'),
    path('users/<int:pk>/unfollow/', AccountModelViewSet.as_view({'post': 'unfollow'}), name='unfollow_user'),
]
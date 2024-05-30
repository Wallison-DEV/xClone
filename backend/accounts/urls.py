from django.urls import path
from rest_framework_simplejwt.views import   TokenBlacklistView

from .views import GoogleSignInView , AccountModelViewSet, CustomTokenObtainPairView, TokenValidateView, CustomTokenRefreshView, GoogleRegisterView

urlpatterns = [
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/validate/', TokenValidateView.as_view(), name='token_validate'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', TokenBlacklistView.as_view(), name='logout'),
    path('my-user/', AccountModelViewSet.as_view({'get': 'my_user'}), name='dados_usuario'),
    path('other-unfollowed-users/', AccountModelViewSet.as_view({'get': 'other_unfollowed_users'}), name='other_unfollowed-users'),
    path('users/<int:pk>/follow/', AccountModelViewSet.as_view({'post': 'follow'}), name='follow_user'),
    path('users/<int:pk>/unfollow/', AccountModelViewSet.as_view({'post': 'unfollow'}), name='unfollow_user'),
    path('update-profile/', AccountModelViewSet.as_view({'patch': 'update_profile'}), name='update_profile'),
    path('accounts/auth/register/google', GoogleRegisterView.as_view(), name='google_register'),
    path('accounts/auth/google/login', GoogleSignInView.as_view(), name='google_login'),
]
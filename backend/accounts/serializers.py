from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from .models import AccountModel

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountModel
        fields = ['id', 'username']

class UserSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True) 
    followers = FollowerSerializer(many=True, read_only=True)
    following = FollowerSerializer(many=True, read_only=True)

    class Meta:
        model = AccountModel
        fields = ['id', 'username', 'email', 'bio', 'followers', 'following', 'created_at', 'arroba', 'profile_image', 'background_image']
        extra_kwargs = {'password': {'write_only': True}}

    def to_representation(self, instance):
        data = super(UserSerializer, self).to_representation(instance)
        data['followers'] = FollowerSerializer(instance.followers.all(), many=True).data
        data['following'] = FollowerSerializer(instance.following.all(), many=True).data
        return data

class CustomTokenObtainPairSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username_or_email = attrs.get('username_or_email')
        password = attrs.get('password')

        user = authenticate(username=username_or_email, password=password)

        if user is None:
            raise serializers.ValidationError('No active user found with the given credentials')

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        return {
            'refresh': str(refresh),
            'access': str(access_token),
            'exp': access_token['exp'], 
        }

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = RefreshToken(attrs['refresh'])
        data['access'] = str(refresh.access_token)
        data['exp'] = int(refresh.access_token['exp'])
        data['refresh'] = str(refresh)
        return data
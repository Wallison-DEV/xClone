from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from django.utils import timezone

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
        fields = ['id', 'username', 'email', 'bio', 'followers', 'following', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}

    def to_representation(self, instance):
        data = super(UserSerializer, self).to_representation(instance)
        data['followers'] = FollowerSerializer(instance.followers.all(), many=True).data
        data['following'] = FollowerSerializer(instance.following.all(), many=True).data
        return data

    def create(self, validated_data):
        user = AccountModel.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user

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


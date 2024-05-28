from rest_framework.views import APIView
from rest_framework import viewsets, status, exceptions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.utils import timezone
from rest_framework.parsers import JSONParser, MultiPartParser
from django.db.models import Q

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import AccountModel
from allauth.socialaccount.models import SocialToken, SocialApp

from .serializers import UserSerializer, CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer

class AccountModelViewSet(viewsets.ModelViewSet):
    queryset = AccountModel.objects.all().order_by('username')
    serializer_class = UserSerializer
    lookup_field = 'pk'
    parser_classes = (JSONParser, MultiPartParser)
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        username_query = request.query_params.get('username', '')
        if username_query:
            filtered_user = AccountModel.objects.filter(
                Q(username__icontains=username_query) | Q(arroba__icontains=username_query)
            )
        else:
            filtered_user = self.get_queryset()

        filtered_user = filtered_user.order_by('username').all()
        serializer = UserSerializer(filtered_user, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def my_user(self, request, pk=None):
        user = request.user
        if not user.is_authenticated:
            raise exceptions.AuthenticationFailed('Usuário não autenticado')
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def other_unfollowed_users(self, request):
        user = request.user
        if not user.is_authenticated:
            raise exceptions.AuthenticationFailed('Usuário não autenticado')
        
        other_users = AccountModel.objects.exclude(pk=user.pk).exclude(pk__in=user.following.all())
        serializer = UserSerializer(other_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk=None):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        arroba = request.data.get('arroba')
        
        if arroba and not arroba.startswith('@'):
            arroba = '@' + arroba

        user = AccountModel.objects.create_user(
            username=username,
            email=email,
            arroba=arroba,
            password=password,
            date_joined=timezone.now()
        )

        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save()
        
    @action(detail=False, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'profile':serializer.data, 'status':status.HTTP_200_OK})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        user_to_follow = self.get_object()
        if request.user == user_to_follow:
            return Response({'error': 'Você não pode seguir a si mesmo.'}, status=status.HTTP_400_BAD_REQUEST)
        elif request.user.following.filter(pk=user_to_follow.pk).exists():
            return Response({'status': 'já seguindo'}, status=status.HTTP_208_ALREADY_REPORTED)
        request.user.following.add(user_to_follow)
        return Response({'status': 'seguindo'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unfollow(self, request, pk=None):
        user_to_unfollow = self.get_object()
        if request.user == user_to_unfollow:
            return Response({'error': 'Você não pode deixar de seguir a si mesmo.'}, status=status.HTTP_400_BAD_REQUEST)
        elif request.user.following.filter(pk=user_to_unfollow.pk).exists():
            request.user.following.remove(user_to_unfollow)
            return Response({'status': 'deixou de seguir'}, status=status.HTTP_200_OK)
        return Response({'status': 'não seguindo'}, status=status.HTTP_404_NOT_FOUND)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class TokenValidateView(APIView):
    def post(self, request):
        token = request.headers.get('Authorization', '').split(' ')[1]
        try:
            UntypedToken(token)  
            return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({'error': 'Invalid token', 'details': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

class GoogleAuthView(APIView):
    authentication_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')

        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            social_token = SocialToken.objects.get(token=token)
            social_app = SocialApp.objects.get(provider='google')
            if social_token.app_id != social_app.pk:
                raise SocialToken.DoesNotExist
        except SocialToken.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except SocialApp.DoesNotExist:
            return Response({'error': 'Google provider not found'}, status=status.HTTP_400_BAD_REQUEST)

        google_user_info = social_token.account.extra_data
        email = google_user_info.get('email')
        if not email:
            return Response({'error': 'Email not found in Google account'}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            username = google_user_info.get('username')
            arroba = username if username else email.split('@')[0]
            user = User.objects.create_user(email=email, username=username, arroba=arroba)

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        exp = access_token['exp']
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'exp': exp
        }, status=status.HTTP_200_OK)

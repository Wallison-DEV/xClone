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

from django.http import JsonResponse
from django.contrib.auth import authenticate, login
import json
import jwt
from rest_framework.authtoken.models import Token
from jwt.exceptions import PyJWTError
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.tokens import RefreshToken

from .models import AccountModel

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
            print('erro:',e)
            return Response({'error': 'Invalid token', 'details': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

class GoogleRegisterView(APIView):
    permission_classes = [AllowAny]
    
    def validate_and_decode_jwt(self, credential):
        try:
            decoded_token = jwt.decode(
                credential,
                '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', 
                algorithms=['RS256'],
                options={"verify_signature": False} 
            )
            return decoded_token
        except PyJWTError as e:
            print(f'JWT validation error: {e}')
            return None

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body.decode('utf-8'))
        credential = data.get('credential')

        decoded_token = self.validate_and_decode_jwt(credential)

        if not decoded_token:
            return JsonResponse({'error': 'Invalid JWT'}, status=400)

        user_email = decoded_token.get('email')
        user_first_name = decoded_token.get('given_name')
        user_last_name = decoded_token.get('family_name')
        
        try:
            user = get_user_model().objects.get(email=user_email)
            return JsonResponse({'message': 'User already exists'}, status=status.HTTP_409_CONFLICT)
        except get_user_model().DoesNotExist:
            pass 

        user, created = get_user_model().objects.get_or_create(email=user_email)

        if created:
            user.first_name = user_first_name
            user.last_name = user_last_name
            user.is_verified = True  
            user.social_provider = 'google'
            user.social_uid = decoded_token.get('sub') 
            user.social_extra_data = {'google': decoded_token}  
            user.save()

        return JsonResponse({'message': 'User registered successfully'}, status=201)

class GoogleSignInView(APIView):
    permission_classes = [AllowAny]
    
    def validate_and_decode_jwt(self, credential):
        try:
            decoded_token = jwt.decode(
                credential,
                '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', 
                algorithms=['RS256'],
                options={"verify_signature": False} 
            )
            return decoded_token
        except PyJWTError as e:
            print(f'JWT validation error: {e}')
            return None

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body.decode('utf-8'))
        credential = data.get('credential')

        decoded_token = self.validate_and_decode_jwt(credential)

        if not decoded_token:
            return JsonResponse({'error': 'Invalid JWT'}, status=400)

        user_email = decoded_token.get('email')

        try:
            user = get_user_model().objects.get(email=user_email)
        except get_user_model().DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=404)

        login(request, user, backend='django.contrib.auth.backends.ModelBackend')

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(access_token),
            'exp': access_token['exp'], 
        })
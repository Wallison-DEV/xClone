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

from google.auth.transport import requests
from google.oauth2 import id_token
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
import random
import string

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
            return Response({'error': 'Invalid token', 'details': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        
        if request.method == "POST":
            if not token:
                return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                idinfo = id_token.verify_oauth2_token(
                    token, requests.Request(), '209545437573-tl5li4kpr58ofi8cegem5o31otoq5b64.apps.googleusercontent.com'
                )
                
                email = idinfo['email']
                print(email)
                user = authenticate(request='/api/token', email=email)
                print('result user:', user)
                if user is not None:
                    login(request, user)
                    return JsonResponse({'success': True})
                else:
                    print('usuário não existe')
                    return JsonResponse({'error': 'User does not exist.'}, status=404)
            except ValueError as e:
                print('except:', e)
                return JsonResponse({'error': 'Invalid token.'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid request method.'}, status=405)

class GoogleRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return JsonResponse({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), '209545437573-tl5li4kpr58ofi8cegem5o31otoq5b64.apps.googleusercontent.com'
            )
            
            email = idinfo['email']
            name = idinfo.get('name', '').split()[0]
            if AccountModel.objects.filter(email=email).exists():
                return JsonResponse({'error': 'User already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                arroba = self.generate_unique_arroba()
                user = AccountModel.objects.create_user(email=email, username=name, arroba=arroba)
                user.save()
                user = authenticate(request, email=email)
                # login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                return JsonResponse({'success': True})
        except ValueError as e:
            print('token inválido', e)
            return JsonResponse({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

    def generate_unique_arroba(self):
        arroba_length = 10
        while True:
            arroba = ''.join(random.choices(string.ascii_letters + string.digits, k=arroba_length))
            if not AccountModel.objects.filter(arroba=arroba).exists():
                return arroba

import json
import jwt
from rest_framework.authtoken.models import Token
from jwt.exceptions import PyJWTError
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import get_user_model

class GoogleSignInView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def validate_and_decode_jwt(self, credential):
        try:
            # Replace 'your_google_client_secret' with your actual Google Client Secret
            decoded_token = jwt.decode(
            credential,
            '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', # your_google_client_secret
            algorithms=['RS256'],
            options={"verify_signature": False}  # Add this line to disable signature verification temporarily
            )

            return decoded_token
        except PyJWTError as e:
            # Handle JWT validation error
            print(f'JWT validation error: {e}')
            return None

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body.decode('utf-8'))

        # Extract relevant information
        credential = data.get('credential')
        client_id = data.get('clientId')
        select_by = data.get('select_by')

        decoded_token = self.validate_and_decode_jwt(credential)

        if not decoded_token:
            # If JWT validation fails, respond with an error
            return JsonResponse({'error': 'Invalid JWT'}, status=400)

        # Extract user information from the decoded token
        user_email = decoded_token.get('email')
        user_first_name = decoded_token.get('given_name')
        user_last_name = decoded_token.get('family_name')

        # Check if the user already exists in your system
        try:
            user = get_user_model().objects.get(email=user_email)
        except get_user_model().DoesNotExist:
            # If the user doesn't exist, create a new user
            user = get_user_model().objects.create_user(email=user_email)

        # Set user fields provided by Google
        user.first_name = user_first_name
        user.last_name = user_last_name
        user.is_verified = True  # Assuming Google verifies users

        # Set social authentication fields
        user.social_provider = 'google'
        user.social_uid = decoded_token.get('sub')  # Use the appropriate field from the Google token
        user.social_extra_data = {'google': decoded_token}  # Store additional data if needed

        # Save the user
        user.save()

        # Log the user in
        login(request, user)

        # Generate or retrieve the authentication token
        token, created = Token.objects.get_or_create(user=user)

        # Example: Respond with a success message and the authentication token
        return JsonResponse({'message': 'Google Sign-In successful!', 'token': token.key})
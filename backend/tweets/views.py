from rest_framework import viewsets, status
from rest_framework.response import Response
from operator import attrgetter
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from itertools import chain

from rest_framework.views import APIView

from .serializers import PostSerializer, CommentSerializer, RetweetSerializer, CombinedPostSerializer
from .models import PostModel, CommentModel, RetweetModel

from accounts.models import AccountModel

class CommentViewSet(viewsets.ModelViewSet):
    queryset = CommentModel.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['user'] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostViewSet(viewsets.ModelViewSet):
    queryset = PostModel.objects.prefetch_related('retweets__user').all()
    serializer_class = PostSerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        content_query = request.query_params.get('content', '')
        if content_query:
            filtered_posts = PostModel.objects.filter(content__icontains=content_query)
        else:
            filtered_posts = self.get_queryset()

        filtered_posts = filtered_posts.order_by('-created_at').all()
        serializer = PostSerializer(filtered_posts, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_tweet(self, request):
        tweet_id = request.data.get('tweet_id')
        try:
            tweet = PostModel.objects.get(pk=tweet_id)
            if request.user == tweet.user:
                serializer = self.get_serializer(tweet, data=request.data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "Você não tem permissão para modificar este tweet."}, status=status.HTTP_403_FORBIDDEN)
        except PostModel.DoesNotExist:
            return Response({"detail": "Tweet não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def all_other_users_posts(self, request):
            user = request.user
            posts = PostModel.objects.exclude(user=user).order_by('-created_at')
            serializer = self.get_serializer(posts, many=True)
            return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def followed_posts(self, request):
        user = request.user
        followed_users = user.following.all()
        posts = PostModel.objects.filter(user__in=followed_users).exclude(user=user).order_by('-created_at')
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_like(self, request, pk=None):
        post = self.get_object()
        if request.user in post.likes.all():
            post.likes.remove(request.user)
            return Response({'status': 'like removido'}, status=status.HTTP_200_OK)
        else:
            post.likes.add(request.user)
            return Response({'status': 'like adicionado'}, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def user_posts(self, request, user_id=None):
        if not user_id:
            return Response({'error': 'O parâmetro user_id é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({'error': 'O parâmetro user_id deve ser um número inteiro válido.'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(AccountModel, pk=user_id)
        posts = PostModel.objects.filter(user=user).order_by('-created_at')
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
    
class RetweetViewSet(viewsets.ModelViewSet):
    queryset = RetweetModel.objects.all()
    serializer_class = RetweetSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        return super().get_serializer_class()
    
    def list(self, request, *args, **kwargs):
        content_query = request.query_params.get('content', '')
        if content_query:
            filtered_retweets = RetweetModel.objects.filter(content__icontains=content_query)
        else:
            filtered_retweets = self.get_queryset()

        filtered_retweets = filtered_retweets.order_by('-created_at').all()
        serializer = RetweetSerializer(filtered_retweets, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['user'] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_retweet(self, request):
        retweet_id = request.data.get('retweet_id')
        try:
            retweet = RetweetModel.objects.get(pk=retweet_id)
            if request.user == retweet.user:
                serializer = self.get_serializer(retweet, data=request.data, partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "Você não tem permissão para modificar este retweet."}, status=status.HTTP_403_FORBIDDEN)
        except RetweetModel.DoesNotExist:
            return Response({"detail": "Retweet não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def all_other_users_retweets(self, request):
            user = request.user
            posts = RetweetModel.objects.exclude(user=user).order_by('-created_at')
            serializer = self.get_serializer(posts, many=True)
            return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def followed_retweets(self, request):
        user = request.user
        followed_users = user.following.all()
        posts = RetweetModel.objects.filter(user__in=followed_users).exclude(user=user).order_by('-created_at')
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_like(self, request, pk=None):
        post = self.get_object()
        if request.user in post.likes.all():
            post.likes.remove(request.user)
            return Response({'status': 'like removido'}, status=status.HTTP_200_OK)
        else:
            post.likes.add(request.user)
            return Response({'status': 'like adicionado'}, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def user_retweets(self, request, user_id=None):
        if not user_id:
            return Response({'error': 'O parâmetro user_id é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({'error': 'O parâmetro user_id deve ser um número inteiro válido.'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(AccountModel, pk=user_id)
        posts = PostModel.objects.filter(user=user).order_by('-created_at')
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)

class CombinedPostViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def list(self, request):
        content_query = request.query_params.get('content', '')
        user = request.user
        
        user_posts = PostModel.objects.all()
        user_retweets = RetweetModel.objects.all()

        combined_posts = sorted(
            chain(user_posts, user_retweets),
            key=attrgetter('created_at'),
            reverse=True
        )

        if content_query:
            combined_posts = [post for post in combined_posts if content_query.lower() in post.content.lower()]

        serializer = CombinedPostSerializer(combined_posts, many=True)
        return Response(serializer.data)

    def get_combined_user_feed(self, user):
        tweets = PostModel.objects.filter(user=user)
        retweets = RetweetModel.objects.filter(user=user)

        combined_posts = sorted(
            chain(tweets, retweets),
            key=attrgetter('created_at'),
            reverse=True
        )

        return combined_posts

    def followed_feed(self, request):
        followed_users = request.user.following.all()
        user = request.user
        user_posts = PostModel.objects.filter(user__in=followed_users).exclude(user=user)
        user_retweets = RetweetModel.objects.filter(user__in=followed_users).exclude(user=user)
        combined_user_posts = sorted(
            chain(user_posts, user_retweets),
            key=attrgetter('created_at'),
            reverse=True
        )
        serializer = CombinedPostSerializer(combined_user_posts, many=True)
        return Response(serializer.data)

    def suggested_feed(self, request):
        user = request.user
        user_posts = PostModel.objects.exclude(user=user)
        user_retweets = RetweetModel.objects.exclude(user=user)
        combined_user_posts = sorted(
            chain(user_posts, user_retweets),
            key=attrgetter('created_at'),
            reverse=True
        )
        serializer = CombinedPostSerializer(combined_user_posts, many=True)
        return Response(serializer.data)

    def user_feed(self, request, user_id=None): 
        if not user_id:
            return Response({'error': 'O parâmetro user_id é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({'error': 'O parâmetro user_id deve ser um número inteiro válido.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(AccountModel, pk=user_id)
        user_posts = PostModel.objects.filter(user=user)
        user_retweets = RetweetModel.objects.filter(user=user)
        combined_user_posts = sorted(
            chain(user_posts, user_retweets),
            key=attrgetter('created_at'),
            reverse=True
        )
        serializer = CombinedPostSerializer(combined_user_posts, many=True)
        return Response(serializer.data)

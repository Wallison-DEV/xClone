from rest_framework import serializers
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.models import ContentType

from .models import PostModel, CommentModel, RetweetModel
from accounts.models import AccountModel

from django.contrib.auth import get_user_model

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    class Meta:
        model = CommentModel
        fields = ['id', 'user', 'content', 'created_at', 'media', 'content_type', 'object_id']
        read_only_fields = ['created_at']

    def get_user(self, obj):
        return {'id': obj.user.id, 'username': obj.user.username}

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        comment = CommentModel.objects.create(**validated_data)
        return comment

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        representation['user'] = self.get_user(instance)
        representation['content_object'] = str(instance.content_object)
        return representation
    
class PostSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()  
    retweets = serializers.SerializerMethodField()
    
    class Meta:
        model = PostModel
        fields = ['id','user','media', 'content', 'created_at', 'likes', 'comments', 'retweets']
        
    def get_user(self, obj):
        return {'id': obj.user.id, 'username': obj.user.username}
        
    def get_likes(self, obj):
        likes_count = obj.likes.count()
        liked_by = [{'id': user.id, 'username': user.username} for user in obj.likes.all()]

        return {
            'count': likes_count,
            'liked_by': liked_by,
        }
        
    def get_retweets(self, obj):
        retweets_data = RetweetModel.objects.filter(tweet=obj)
        retweet_serializer = RetweetSerializer(retweets_data, many=True)
        return retweet_serializer.data
    
    def get_comments(self, obj):
        comments_data = CommentModel.objects.filter(content_type__model='postmodel', object_id=obj.id)
        comments_serializer = CommentSerializer(comments_data, many=True)
        return comments_serializer.data
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        representation['user'] = self.get_user(instance)
        representation['likes'] = self.get_likes(instance)
        representation['comments'] = self.get_comments(instance)  
        representation['retweets'] = self.get_retweets(instance)  
        
        return representation

    def create(self, validated_data):
        likes_data = validated_data.pop('likes', None)
        retweets_data = validated_data.pop('retweets', None)  
        
        post = PostModel.objects.create(**validated_data)

        if retweets_data:
            for retweet in retweets_data:
                RetweetModel.objects.create(post=post, **retweet)

        if likes_data:
            post.likes.set(likes_data)
        post.save()

        return post

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance

class RetweetSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    
    class Meta:
        model = RetweetModel
        fields = ['id','user','media', 'content', 'created_at', 'likes', 'comments']
        
    def get_user(self, obj):
        return {'id': obj.user.id, 'username': obj.user.username}
        
    def create(self, validated_data):
        tweet_id = self.context['request'].data.get('tweet')
        if not tweet_id:
            raise serializers.ValidationError({"tweet": "Este campo é obrigatório."})

        tweet = PostModel.objects.get(id=tweet_id)
        retweet = RetweetModel.objects.create(tweet=tweet, **validated_data)

        return retweet
    
    def get_likes(self, obj):
        likes_count = obj.likes.count()
        liked_by = [{'id': user.id, 'username': user.username} for user in obj.likes.all()]

        return {
            'count': likes_count,
            'liked_by': liked_by,
        }
        
    def get_tweet_id(self, obj):
        return obj.tweet.id if obj.tweet_id is not None else None

    def get_comments(self, obj):
        comments_data = CommentModel.objects.filter(content_type__model='retweetmodel', object_id=obj.id)
        comments_serializer = CommentSerializer(comments_data, many=True)
        return comments_serializer.data
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        representation['user'] = self.get_user(instance)
        representation['likes'] = self.get_likes(instance)
        representation['comments'] = self.get_comments(instance)  
        representation['tweet_id'] = self.get_tweet_id(instance)
        
        return representation

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance

class CombinedPostSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        if isinstance(instance, PostModel):
            post_serializer = PostSerializer(instance)
            return post_serializer.data
        elif isinstance(instance, RetweetModel):
            retweet_serializer = RetweetSerializer(instance)
            return retweet_serializer.data
        else:
            return None

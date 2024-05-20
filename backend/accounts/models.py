from django.contrib.auth.models import AbstractUser
from django.db import models

class AccountModel(AbstractUser):
    bio = models.TextField(max_length=500, blank=True)
    arroba = models.TextField(max_length=20, unique=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    background_image = models.ImageField(upload_to='background_images/', blank=True, null=True)
    followers = models.ManyToManyField('self', symmetrical=False, related_name='followers_set', blank=True)
    following = models.ManyToManyField('self', symmetrical=False, related_name='following_set', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="user_set_custom",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="user_set_custom",
        related_query_name="user",
    )

    def __str__(self):
        return self.username

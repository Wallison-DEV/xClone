import os

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-mrj*me#@=7)0aj@lh)1*0$9#0s5dud+2iebge=zi-(rhiz17!b"

DEBUG = True

ALLOWED_HOSTS = ['wallison.pythonanywhere.com', 'localhost', '127.0.0.1', 'x-clone-backend-cyan.vercel.app']

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "accounts",
    "tweets",

    "rest_framework",
    'rest_framework_simplejwt',
    'corsheaders',
]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'corsheaders.middleware.CorsMiddleware',
]

AUTH_USER_MODEL = 'accounts.AccountModel'

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://wallison.pythonanywhere.com',
    'https://x-clone-frontend-neon.vercel.app',
]

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS' 
]

CORS_ALLOW_HEADERS = [
    'Authorization',
    'Content-Type',
]

CORS_ALLOW_CREDENTIALS = True
APPEND_SLASH = False

ROOT_URLCONF = "twitter.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "twitter.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": os.environ.get('django.db.backends.postgresql', 'django.db.backends.sqlite3'),
        "NAME": os.environ.get('xclone_dev', os.path.join(BASE_DIR, 'db.sqlite3')),
        "USER": os.environ.get('wallison', 'user'),
        "PASSWORD": os.environ.get('135543223432', 'password'),
        "HOST": os.environ.get('db', 'localhost'),
        "PORT": os.environ.get('5432', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "pt-br"

TIME_ZONE = "America/Sao_Paulo"

USE_I18N = True

USE_TZ = True

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL = "/static/"

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

INTERNAL_IPS = {
    '127.0.0.1',
}
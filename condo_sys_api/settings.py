from pathlib import Path
import decouple
import os
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = decouple.config('SECRET_KEY')
DEBUG = decouple.config('DEBUG', cast=bool)
ALLOWED_HOSTS = decouple.config('ALLOWED_HOSTS').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'drf_yasg',

    'apps.users',
    'apps.buildings',
    'apps.finances',
    'apps.communication',
    'apps.common',
    'apps.settings',
    'apps.notifications',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'condo_sys_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'apps' / 'emails' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'condo_sys_api.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / decouple.config('DATABASE_NAME'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'es'
TIME_ZONE = 'America/Santiago'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework config
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'PAGE_SIZE': 10,
}
# Settings JWT
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=15),    
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),      
    "ROTATE_REFRESH_TOKENS": True,                     
    "BLACKLIST_AFTER_ROTATION": True,   
}
# CORS
CORS_ALLOW_ALL_ORIGINS = True

# Custom User Model (si se configura después)
AUTH_USER_MODEL = 'users.User'

# Configuración envío de correos
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'condosys21@gmail.com'
if DEBUG:
    EMAIL_HOST = 'sandbox.smtp.mailtrap.io'
    EMAIL_HOST_USER = '40e7f487f25a57'
    EMAIL_HOST_PASSWORD = 'bbc9e4f33ec8ff'
    EMAIL_PORT = '2525'
else:
    EMAIL_HOST = 'live.smtp.mailtrap.io'
    EMAIL_HOST_USER = 'api'
    EMAIL_HOST_PASSWORD = '97b6c15931912848d57931dea3eda960'
    EMAIL_PORT = '587'
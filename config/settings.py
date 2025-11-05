
import os
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

print("✅ Iniciando settings Django con Docker...")
print(f"📦 Base DIR: {BASE_DIR}")
print(f"🪙 MP_ACCESS_TOKEN: {os.getenv('MP_ACCESS_TOKEN')[:10]}...")

# MERCADO PAGO CONFIG
MP_PUBLIC_KEY = os.getenv('MP_PUBLIC_KEY')
MP_ACCESS_TOKEN = os.getenv('MP_ACCESS_TOKEN')
WEBHOOK_URL = os.getenv('WEBHOOK_URL')

# GoHighLevel CONFIG
GHL_TOKEN = os.getenv('GHL_TOKEN')
GHL_BASE_URL = os.getenv('GHL_BASE_URL')
GHL_API_BASE_URL = os.getenv('GHL_API_BASE_URL')
GHL_VERSION = os.getenv('GHL_VERSION')
GHL_LOCATION_ID = os.getenv('GHL_LOCATION_ID')
GHL_CONTACT_ID = os.getenv('GHL_CONTACT_ID')


# OAuth GHL
GHL_CLIENT_ID = os.getenv('GHL_CLIENT_ID')
GHL_CLIENT_SECRET = os.getenv('GHL_CLIENT_SECRET')
GHL_REDIRECT_URI = os.getenv('GHL_REDIRECT_URI')


# Build paths inside the project like this: BASE_DIR / 'subdir'.

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-!h^#348u#m(a@rn--h4c@*m$(=hj*s$*h8x+-(h&h)=!bn6e2('

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    
    # django apps por defecto
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # terceros
    "corsheaders",
    
    # apps locales
    'payments',
    'auth_app',
    'dashboard_api',
    'core'
]

AUTH_USER_MODEL = 'auth_app.User'


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # Middleware personalizado para registrar auditoría
    "payments.middleware.RequestLogMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True
ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'ghlmp_db'),
        'USER': os.getenv('DB_USER', 'ghluser'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'ghlpass'),
        'HOST': os.getenv('DB_HOST', 'db'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
"""
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('MYSQL_DB', '2_caso_mp'),
        'USER': os.getenv('MYSQL_USER', 'root'),
        'PASSWORD': os.getenv('MYSQL_PASSWORD', ''),
        'HOST': os.getenv('MYSQL_HOST', 'localhost'),
        'PORT': os.getenv('MYSQL_PORT', '3306'),
        'OPTIONS': {'charset': 'utf8mb4'},
    }
}
"""



# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

# ZONA HORARIA Y LENGUAJE   
LANGUAGE_CODE = 'es-pe'                 # pe  # en-us

TIME_ZONE = 'America/Lima'                       # america/lima  # UTC

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# STATIC_ROOT = BASE_DIR / 'static'


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

from corsheaders.defaults import default_headers
CORS_ALLOW_HEADERS = list(default_headers) + [
    "authorization",
]

print("✅ Configuración cargada correctamente.")

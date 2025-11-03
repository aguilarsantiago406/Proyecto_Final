# MVP- Integración MercadoPago y GoHighLevel

Este proyecto es una aplicación Django que integra pagos con MercadoPago y sincronización con GoHighLevel (GHL) para gestión de citas y contactos.

## 🚀 Características

- **Integración con MercadoPago**: Creación de preferencias de pago y manejo de webhooks
- **Sincronización con GoHighLevel**: Actualización automática de pagos aprobados
- **Sistema de auditoría**: Registro de eventos y logs de operaciones
- **API REST**: Endpoints para crear pagos, listar pagos y consultar logs
- **Middleware de logging**: Registro automático de todas las requests

## 📋 Requisitos

- Python 3.8+
- Django 4.2+
- Base de datos SQLite (por defecto) o MySQL

## 🛠️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/aguilarsantiago406/Proyecto_Final.git
   cd Proyecto_Final
   ```

2. **Crea un entorno virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configura las variables de entorno:**
   - Copia `.env.example` a `.env`
   - Completa las variables requeridas (tokens de MercadoPago y GHL)

5. **Ejecuta las migraciones:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Inicia el servidor:**
   ```bash
   python manage.py runserver
   ```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Base de Datos
MYSQL_USER=tu_usuario_mysql
MYSQL_PASSWORD=tu_password_mysql
MYSQL_HOST=localhost
MYSQL_DB=nombre_base_datos
MYSQL_PORT=3306

# MercadoPago
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxx
MP_PUBLIC_KEY=APP_USR-xxxxxxxxxxxxx

# GoHighLevel
GHL_TOKEN=pit-xxxxxxxxxxxxx
GHL_BASE_URL=https://rest.gohighlevel.com/v1
GHL_API_BASE_URL=https://services.leadconnectorhq.com
GHL_VERSION=2021-04-15
GHL_LOCATION_ID=tu_location_id
GHL_CALENDAR_ID=tu_calendar_id

# Webhooks
WEBHOOK_URL=https://tu-dominio.ngrok-free.dev/payments/webhooks/mp/
```

## 📡 API Endpoints

### Pagos
- `POST /payments/create/` - Crear nueva preferencia de pago
- `GET /payments/` - Listar últimos 4 pagos
- `GET /payments/logs/` - Listar últimos 10 logs de auditoría

### Webhooks
- `POST /payments/webhooks/mp/` - Webhook de MercadoPago

## 🗄️ Modelos de Datos

### Payment
- `appointment_id`: ID de la cita
- `contact_id`: ID del contacto en GHL
- `preference_id`: ID de preferencia MercadoPago
- `payment_id`: ID del pago MercadoPago
- `amount`: Monto del pago
- `status`: Estado del pago (pending, approved, etc.)
- `description`: Descripción del pago
- `ghl_notified`: Flag de notificación a GHL
- `created_at`: Fecha de creación

### AuditLog
- `event`: Tipo de evento
- `user_id`: ID del usuario
- `timestamp`: Fecha y hora
- `details`: Detalles en formato JSON

## 🔄 Flujo de Trabajo

1. **Creación de Pago**: Se crea una preferencia en MercadoPago
2. **Pago del Usuario**: El usuario completa el pago en MercadoPago
3. **Webhook**: MercadoPago notifica el estado del pago
4. **Actualización Local**: Se actualiza el estado en la base de datos
5. **Notificación GHL**: Si el pago es aprobado, se notifica a GoHighLevel
6. **Auditoría**: Todos los eventos se registran en los logs

## 🧪 Pruebas

Para probar la aplicación:

1. **Verificar configuración:**
   ```bash
   python manage.py check
   ```

2. **Ejecutar servidor:**
   ```bash
   python manage.py runserver
   ```

3. **Probar endpoints:**
   ```bash
   # Listar pagos
   curl http://localhost:8000/payments/

   # Listar logs
   curl http://localhost:8000/payments/logs/
   ```

## 📁 Estructura del Proyecto

```
proyecto_final/
├── config/                 # Configuración Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── payments/               # App principal
│   ├── models.py           # Modelos Payment y AuditLog
│   ├── views.py            # Vistas API
│   ├── urls.py             # URLs de la app
│   ├── webhooks.py         # Manejo de webhooks
│   ├── middleware.py       # Middleware de logging
│   ├── services/           # Servicios externos
│   │   ├── mercadopago_service.py
│   │   └── ghl_service.py
│   └── utils/              # Utilidades
│       ├── audit.py
│       └── idempotency.py
├── logs/                   # Logs de auditoría
├── static/                 # Archivos estáticos
├── .env                    # Variables de entorno (no versionado)
├── .env.example            # Ejemplo de configuración
├── .gitignore              # Archivos ignorados
├── manage.py               # Script de Django
├── requirements.txt        # Dependencias Python
└── README.md               # Este archivo
```

## 🤝 Contribución

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios y commits
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request

## 📝 Notas

- El proyecto incluye configuración para desarrollo con ngrok para webhooks
- La base de datos por defecto es SQLite, pero se puede cambiar a MySQL
- Los logs se almacenan tanto en base de datos como en archivos JSON
- El middleware registra automáticamente todas las requests HTTP



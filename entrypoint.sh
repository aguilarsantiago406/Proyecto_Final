#!/bin/bash
echo "⏳ Esperando a que la base de datos esté lista..."

until nc -z db 5432; do
  echo "🕐 Esperando a PostgreSQL..."
  sleep 2
done

echo "✅ Base de datos lista. Ejecutando migraciones..."
python manage.py migrate --noinput

echo "📦 Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

echo "🚀 Iniciando servidor Django..."
python manage.py runserver 0.0.0.0:8000

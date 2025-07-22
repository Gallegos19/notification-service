#!/bin/bash

# Script de configuración inicial para Xuma'a Notification Service
echo "🌱 Configurando Xuma'a Notification Service..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "⚙️ Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor configura tus variables de entorno."
    echo "📝 Edita el archivo .env con tus credenciales:"
    echo "   - DATABASE_URL"
    echo "   - SENDGRID_API_KEY"
    echo "   - JWT_SECRET"
    echo "   - Otras variables necesarias"
else
    echo "✅ Archivo .env ya existe."
fi

# Verificar si PostgreSQL está corriendo
echo "🔍 Verificando conexión a PostgreSQL..."
if command -v psql &> /dev/null; then
    # Intentar conectar a PostgreSQL (esto puede fallar si no está configurado)
    echo "📊 PostgreSQL encontrado. Asegúrate de que esté corriendo y configurado."
else
    echo "⚠️ PostgreSQL no encontrado. Puedes usar Docker:"
    echo "   docker-compose up -d postgres"
fi

# Generar cliente de Prisma
echo "🔧 Generando cliente de Prisma..."
npx prisma generate

# Mostrar próximos pasos
echo ""
echo "✅ Configuración inicial completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura tu archivo .env con las credenciales correctas"
echo "2. Asegúrate de que PostgreSQL esté corriendo"
echo "3. Ejecuta las migraciones: npm run prisma:migrate"
echo "4. Inicia el servicio en desarrollo: npm run dev"
echo ""
echo "🚀 Para usar Docker:"
echo "   docker-compose up -d"
echo ""
echo "📖 Lee el README.md para más información sobre la configuración."
echo ""
echo "🌱 ¡Listo para ayudar a salvar el planeta con Xuma'a!"
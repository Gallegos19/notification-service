@echo off
echo 🌱 Configurando Xuma'a Notification Service...

REM Verificar que Node.js esté instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18+ primero.
    pause
    exit /b 1
)

REM Verificar que npm esté instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado. Por favor instala npm primero.
    pause
    exit /b 1
)

REM Instalar dependencias
echo 📦 Instalando dependencias...
npm install

REM Verificar si existe el archivo .env
if not exist .env (
    echo ⚙️ Creando archivo .env desde .env.example...
    copy .env.example .env
    echo ✅ Archivo .env creado. Por favor configura tus variables de entorno.
    echo 📝 Edita el archivo .env con tus credenciales:
    echo    - DATABASE_URL
    echo    - SENDGRID_API_KEY
    echo    - JWT_SECRET
    echo    - Otras variables necesarias
) else (
    echo ✅ Archivo .env ya existe.
)

REM Generar cliente de Prisma
echo 🔧 Generando cliente de Prisma...
npx prisma generate

REM Mostrar próximos pasos
echo.
echo ✅ Configuración inicial completada!
echo.
echo 📋 Próximos pasos:
echo 1. Configura tu archivo .env con las credenciales correctas
echo 2. Asegúrate de que PostgreSQL esté corriendo
echo 3. Ejecuta las migraciones: npm run prisma:migrate
echo 4. Inicia el servicio en desarrollo: npm run dev
echo.
echo 🚀 Para usar Docker:
echo    docker-compose up -d
echo.
echo 📖 Lee el README.md para más información sobre la configuración.
echo.
echo 🌱 ¡Listo para ayudar a salvar el planeta con Xuma'a!
pause
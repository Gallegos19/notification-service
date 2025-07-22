# 🌱 Xuma'a Notification Service

Servicio de notificaciones para la aplicación Xuma'a que maneja el envío de correos electrónicos y notificaciones push usando arquitectura hexagonal.

## 🚀 Características

- **📧 Correos electrónicos** con SendGrid
- **📱 Notificaciones Push** con Firebase
- **🎨 Templates HTML** personalizados para Xuma'a
- **🔐 Autenticación JWT** para microservicios
- **📊 Historial de notificaciones** con PostgreSQL
- **🏗️ Arquitectura hexagonal** limpia y mantenible

## 📋 Requisitos

- Node.js 18+
- PostgreSQL
- Cuenta de SendGrid
- Proyecto de Firebase configurado

## ⚙️ Configuración

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/notification_db"
SENDGRID_API_KEY="tu_api_key_de_sendgrid"
SENDGRID_FROM_EMAIL="noreply@xumaa.com"
SENDGRID_FROM_NAME="Xuma'a"
JWT_SECRET="tu_jwt_secret"
PORT=3005
NODE_ENV="development"
FIREBASE_PROJECT_ID="xuma-6f453"
```

3. **Configurar base de datos:**
```bash
npm run prisma:migrate
npm run prisma:generate
```

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

## 📡 API Endpoints

### Autenticación
Todos los endpoints requieren un token Bearer JWT en el header:
```
Authorization: Bearer <token>
```

### Endpoints disponibles

#### 📧 Enviar correo general
```http
POST /api/notifications/email
Content-Type: application/json

{
  "to": "usuario@ejemplo.com",
  "subject": "Asunto del correo",
  "templateName": "general", // opcional
  "templateData": {
    "content": "<h2>¡Hola!</h2><p>Este es un mensaje de Xuma'a</p>"
  },
  "htmlContent": "<html>...</html>" // alternativo a template
}
```

#### 🎉 Enviar correo de bienvenida
```http
POST /api/notifications/email/welcome
Content-Type: application/json

{
  "to": "nuevo@usuario.com",
  "userName": "Juan Pérez",
  "appUrl": "https://xumaa.com"
}
```

#### ⏰ Enviar correo de recordatorio
```http
POST /api/notifications/email/reminder
Content-Type: application/json

{
  "to": "usuario@ejemplo.com",
  "userName": "Juan Pérez",
  "reminderType": "Desafío pendiente",
  "reminderMessage": "Tienes un desafío ambiental esperándote",
  "ecoFact": "¿Sabías que reciclar una lata de aluminio ahorra energía suficiente para ver TV por 3 horas?",
  "appUrl": "https://xumaa.com"
}
```

#### 📱 Enviar notificación push
```http
POST /api/notifications/push
Content-Type: application/json

{
  "deviceToken": "token_del_dispositivo",
  "title": "¡Nueva misión disponible!",
  "body": "Completa tu desafío diario y gana puntos",
  "data": {
    "type": "challenge",
    "challengeId": "123"
  },
  "imageUrl": "https://ejemplo.com/imagen.jpg"
}
```

#### 📊 Obtener historial
```http
GET /api/notifications/history?recipient=usuario@ejemplo.com&limit=10&offset=0
```

#### 🏥 Health check
```http
GET /health
```

## 🎨 Templates disponibles

- **welcome**: Correo de bienvenida para nuevos usuarios
- **reminder**: Correos de recordatorio personalizables
- **general**: Template genérico para cualquier contenido

## 🔐 Autenticación de microservicios

Para que otros microservicios usen este servicio, deben incluir un JWT válido:

```javascript
const token = jwt.sign(
  { 
    service: 'auth-service',
    id: 'service-id' 
  }, 
  JWT_SECRET
);

// Usar en headers
headers: {
  'Authorization': `Bearer ${token}`
}
```

## 🏗️ Arquitectura

```
src/
├── domain/              # Entidades y reglas de negocio
│   ├── entities/
│   └── repositories/
├── application/         # Casos de uso
│   ├── ports/
│   └── use-cases/
├── infrastructure/      # Implementaciones externas
│   ├── config/
│   ├── database/
│   ├── external/
│   ├── security/
│   └── web/
└── shared/             # Recursos compartidos
    ├── assets/         # Iconos de Xuma'a
    └── templates/      # Templates HTML
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Test de cobertura
npm run test:coverage
```

## 🚀 Producción

```bash
# Construir
npm run build

# Ejecutar
npm start
```

## 📝 Logs

El servicio registra todas las operaciones importantes. En desarrollo verás logs detallados en consola.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de Xuma'a - Aplicación de concientización ambiental.
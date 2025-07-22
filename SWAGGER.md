# 📚 Documentación API con Swagger

## 🚀 Acceso a la Documentación

Una vez que el servicio esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

- **Interfaz Web**: http://localhost:3005/api-docs
- **JSON Spec**: http://localhost:3005/api-docs.json

## 🎯 Características de la Documentación

### ✅ Documentación Completa
- **Todos los endpoints** documentados con ejemplos
- **Schemas de request/response** detallados
- **Códigos de estado** y mensajes de error
- **Ejemplos prácticos** para cada endpoint

### 🔐 Autenticación Integrada
- **Botón "Authorize"** en la interfaz de Swagger
- **Persistencia de token** durante la sesión
- **Ejemplos de autenticación** para microservicios

### 🎨 Interfaz Personalizada
- **Colores de Xuma'a** (verde #4CAF50)
- **Iconos y emojis** para mejor UX
- **Filtros y búsqueda** habilitados
- **Expansión inteligente** de modelos

## 📋 Endpoints Documentados

### 🏥 Health Check
```
GET /health
```
- Verifica el estado del servicio
- No requiere autenticación
- Retorna información del servicio y timestamp

### 📧 Correos Electrónicos

#### Envío General
```
POST /api/notifications/email
```
- Envío de correos con template o HTML personalizado
- Requiere autenticación JWT
- Soporte para templates: `welcome`, `reminder`, `general`

#### Correo de Bienvenida
```
POST /api/notifications/email/welcome
```
- Template específico para nuevos usuarios
- Incluye branding de Xuma'a
- Personalizable con nombre de usuario y URL

#### Correo de Recordatorio
```
POST /api/notifications/email/reminder
```
- Para usuarios inactivos
- Incluye datos ecológicos interesantes
- Personalizable por tipo de recordatorio

### 📱 Notificaciones Push

#### Envío de Push Notification
```
POST /api/notifications/push
```
- Envío a dispositivos específicos via Firebase
- Soporte para datos adicionales
- Imágenes opcionales

### 📊 Historial

#### Consultar Historial
```
GET /api/notifications/history
```
- Historial completo de notificaciones
- Filtros por destinatario
- Paginación con limit/offset

## 🛠️ Cómo Usar la Documentación

### 1. Autenticación
1. Haz clic en el botón **"Authorize"** 🔒
2. Ingresa tu JWT token en el formato: `Bearer tu_token_aqui`
3. Haz clic en **"Authorize"**
4. El token se aplicará automáticamente a todas las requests

### 2. Probar Endpoints
1. Selecciona el endpoint que quieres probar
2. Haz clic en **"Try it out"**
3. Modifica los parámetros según necesites
4. Haz clic en **"Execute"**
5. Revisa la respuesta en tiempo real

### 3. Copiar Ejemplos
- Cada endpoint incluye **ejemplos completos**
- Puedes copiar el JSON directamente
- Los ejemplos incluyen datos realistas de Xuma'a

## 📝 Ejemplos de Uso

### Autenticación JWT
```bash
# Generar token (ejemplo con Node.js)
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { 
    service: 'auth-service',
    id: 'service-id' 
  }, 
  'tu_jwt_secret'
);
```

### Enviar Correo de Bienvenida
```bash
curl -X POST "http://localhost:3005/api/notifications/email/welcome" \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "nuevo@usuario.com",
    "userName": "Juan Pérez",
    "appUrl": "https://xumaa.com"
  }'
```

### Enviar Push Notification
```bash
curl -X POST "http://localhost:3005/api/notifications/push" \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "firebase_device_token",
    "title": "🌱 ¡Nueva misión!",
    "body": "Completa tu desafío diario",
    "data": {
      "type": "challenge",
      "challengeId": "123"
    }
  }'
```

## 🎨 Personalización de Templates

### Templates Disponibles

#### Welcome Template
- **Uso**: Nuevos usuarios
- **Variables**: `userName`, `appUrl`
- **Estilo**: Verde Xuma'a con iconos de mascotas

#### Reminder Template  
- **Uso**: Usuarios inactivos
- **Variables**: `userName`, `reminderType`, `reminderMessage`, `ecoFact`, `appUrl`
- **Estilo**: Naranja para llamar la atención

#### General Template
- **Uso**: Contenido personalizado
- **Variables**: `content` (HTML libre)
- **Estilo**: Verde Xuma'a básico

## 🔍 Schemas Principales

### SendEmailRequest
```json
{
  "to": "string (email)",
  "subject": "string (1-200 chars)",
  "templateName": "welcome|reminder|general",
  "templateData": "object",
  "htmlContent": "string (alternativo)",
  "textContent": "string (opcional)"
}
```

### SendPushNotificationRequest
```json
{
  "deviceToken": "string (Firebase token)",
  "title": "string (1-100 chars)",
  "body": "string (1-500 chars)",
  "data": "object (opcional)",
  "imageUrl": "string (URL, opcional)"
}
```

### NotificationHistory
```json
{
  "id": "string (CUID)",
  "type": "EMAIL|PUSH_NOTIFICATION",
  "recipient": "string",
  "subject": "string (solo emails)",
  "content": "string",
  "status": "PENDING|SENT|FAILED|DELIVERED",
  "sentAt": "datetime",
  "errorMessage": "string (si falló)",
  "metadata": "object"
}
```

## 🚨 Códigos de Error Comunes

### 400 - Bad Request
```json
{
  "error": "Validation error",
  "message": "El email debe tener un formato válido"
}
```

### 401 - Unauthorized
```json
{
  "error": "Access denied",
  "message": "Invalid token"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to send notification"
}
```

## 🔧 Configuración Avanzada

### Variables de Entorno para Swagger
```env
# Opcional: Personalizar la documentación
SWAGGER_TITLE="Mi API de Notificaciones"
SWAGGER_DESCRIPTION="Descripción personalizada"
SWAGGER_VERSION="2.0.0"
```

### Personalizar Swagger UI
El archivo `src/infrastructure/config/swagger.ts` contiene toda la configuración de Swagger, incluyendo:
- Definición de schemas
- Configuración de seguridad
- Ejemplos personalizados
- Estilos CSS

## 📱 Integración con Microservicios

### Desde Auth Service
```javascript
// Enviar correo de bienvenida después del registro
const response = await fetch('http://notification-service:3005/api/notifications/email/welcome', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: user.email,
    userName: user.name,
    appUrl: process.env.APP_URL
  })
});
```

### Desde Gamification Service
```javascript
// Enviar push notification por logro
const response = await fetch('http://notification-service:3005/api/notifications/push', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    deviceToken: user.deviceToken,
    title: '🏆 ¡Logro desbloqueado!',
    body: `Has obtenido la insignia ${achievement.name}`,
    data: {
      type: 'achievement',
      achievementId: achievement.id
    }
  })
});
```

## 🎯 Tips para Desarrolladores

1. **Usa el botón "Authorize"** para no tener que poner el token en cada request
2. **Revisa los ejemplos** antes de implementar
3. **Usa el filtro** para encontrar endpoints rápidamente
4. **Copia el curl** generado automáticamente
5. **Revisa los schemas** para entender la estructura de datos

¡La documentación de Swagger hace que integrar el servicio de notificaciones sea súper fácil! 🚀
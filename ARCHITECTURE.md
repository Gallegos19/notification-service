# 🏗️ Arquitectura del Xuma'a Notification Service

## Resumen

El Xuma'a Notification Service está construido siguiendo los principios de **Arquitectura Hexagonal** (también conocida como Ports and Adapters), lo que garantiza un código limpio, mantenible y testeable.

## 🎯 Principios de Diseño

### Arquitectura Hexagonal
- **Dominio**: Lógica de negocio pura, independiente de frameworks
- **Aplicación**: Casos de uso y puertos (interfaces)
- **Infraestructura**: Implementaciones concretas y adaptadores externos

### Inversión de Dependencias
- El dominio no depende de la infraestructura
- Las dependencias apuntan hacia adentro (hacia el dominio)
- Uso de interfaces para desacoplar componentes

## 📁 Estructura del Proyecto

```
src/
├── domain/                     # 🎯 Núcleo del negocio
│   ├── entities/              # Entidades de dominio
│   │   └── Notification.ts    # Entidad principal
│   └── repositories/          # Interfaces de repositorios
│       └── NotificationRepository.ts
│
├── application/               # 📋 Casos de uso
│   ├── ports/                # Interfaces (puertos)
│   │   ├── EmailService.ts
│   │   ├── PushNotificationService.ts
│   │   └── TemplateService.ts
│   └── use-cases/            # Lógica de aplicación
│       ├── SendEmailUseCase.ts
│       ├── SendPushNotificationUseCase.ts
│       └── GetNotificationHistoryUseCase.ts
│
├── infrastructure/           # 🔧 Implementaciones externas
│   ├── config/              # Configuración
│   │   ├── container.ts     # Inyección de dependencias
│   │   ├── database.ts      # Configuración de BD
│   │   └── logger.ts        # Configuración de logs
│   ├── database/            # Persistencia
│   │   └── PrismaNotificationRepository.ts
│   ├── external/            # Servicios externos
│   │   ├── SendGridEmailService.ts
│   │   ├── FirebasePushNotificationService.ts
│   │   └── EmailTemplateService.ts
│   ├── security/            # Seguridad
│   │   └── AuthMiddleware.ts
│   └── web/                 # API REST
│       ├── controllers/
│       ├── routes/
│       └── validators/
│
└── shared/                  # 🤝 Recursos compartidos
    ├── assets/             # Iconos de Xuma'a
    └── templates/          # Templates HTML
```

## 🔄 Flujo de Datos

### Envío de Email
```
HTTP Request → Controller → Use Case → Email Service → SendGrid API
                    ↓
              Repository → Database (Historial)
```

### Envío de Push Notification
```
HTTP Request → Controller → Use Case → Push Service → Firebase API
                    ↓
              Repository → Database (Historial)
```

## 🧩 Componentes Principales

### 1. Domain Layer (Dominio)

#### Notification Entity
```typescript
class Notification {
  // Propiedades inmutables
  // Métodos de negocio (markAsSent, markAsFailed)
  // Factory methods (createEmail, createPushNotification)
}
```

#### Repository Interface
```typescript
interface NotificationRepository {
  save(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  // ... otros métodos
}
```

### 2. Application Layer (Aplicación)

#### Use Cases
- **SendEmailUseCase**: Orquesta el envío de emails
- **SendPushNotificationUseCase**: Orquesta el envío de push notifications
- **GetNotificationHistoryUseCase**: Recupera historial de notificaciones

#### Ports (Interfaces)
- **EmailService**: Abstracción para envío de emails
- **PushNotificationService**: Abstracción para push notifications
- **TemplateService**: Abstracción para renderizado de templates

### 3. Infrastructure Layer (Infraestructura)

#### Adapters
- **SendGridEmailService**: Implementación concreta para SendGrid
- **FirebasePushNotificationService**: Implementación para Firebase
- **PrismaNotificationRepository**: Implementación con Prisma ORM

#### Web Layer
- **Controllers**: Manejan requests HTTP
- **Routes**: Definen endpoints de la API
- **Validators**: Validan entrada con Joi
- **Middleware**: Autenticación JWT

## 🔐 Seguridad

### Autenticación
- **JWT Bearer Token** para todos los endpoints
- **Service-to-Service Authentication** para microservicios
- Validación de tokens con middleware personalizado

### Validación
- **Joi schemas** para validar requests
- Sanitización de datos de entrada
- Manejo seguro de errores

## 📊 Persistencia

### Base de Datos
- **PostgreSQL** como base de datos principal
- **Prisma ORM** para acceso a datos
- **Migraciones** versionadas

### Schema
```sql
notification_history {
  id: String (CUID)
  type: NotificationType (EMAIL | PUSH_NOTIFICATION)
  recipient: String
  subject: String?
  content: String
  status: NotificationStatus
  sentAt: DateTime
  errorMessage: String?
  metadata: Json?
}
```

## 🚀 Servicios Externos

### SendGrid (Email)
- API key authentication
- HTML templates con branding de Xuma'a
- Manejo de errores y reintentos

### Firebase (Push Notifications)
- Service account authentication
- Soporte para Android y iOS
- Payload personalizable

## 🎨 Templates

### Sistema de Templates
- **Base template** con branding de Xuma'a
- **Welcome template** para nuevos usuarios
- **Reminder template** para recordatorios
- **General template** para contenido personalizado

### Assets
- Logo de Xuma'a
- Iconos de mascotas (Dexter, Elly, Paxoloth, Yami)
- Colores y estilos consistentes

## 🧪 Testabilidad

### Ventajas de la Arquitectura Hexagonal
- **Mocking fácil** de servicios externos
- **Tests unitarios** del dominio sin dependencias
- **Tests de integración** con adaptadores reales
- **Tests de contrato** para interfaces

### Estrategia de Testing
```
Domain Tests → Use Case Tests → Integration Tests → E2E Tests
```

## 📈 Escalabilidad

### Horizontal Scaling
- Stateless service design
- Database connection pooling
- Load balancer ready

### Performance
- Async/await para operaciones I/O
- Connection pooling con Prisma
- Logging estructurado para monitoring

## 🔧 Configuración

### Environment Variables
- Separación clara de configuración
- Validación de variables requeridas
- Diferentes configs por ambiente

### Dependency Injection
- Container pattern para gestión de dependencias
- Lazy loading de servicios
- Fácil intercambio de implementaciones

## 🚦 Monitoreo

### Logging
- **Winston** para logging estructurado
- Diferentes niveles por ambiente
- Rotación automática de logs

### Health Checks
- Endpoint `/health` para monitoring
- Verificación de servicios externos
- Métricas de base de datos

## 🔄 CI/CD Ready

### Docker
- Multi-stage build para optimización
- Non-root user para seguridad
- Health checks integrados

### Deployment
- Environment-specific configurations
- Database migrations automáticas
- Graceful shutdown handling

## 🎯 Beneficios de esta Arquitectura

1. **Mantenibilidad**: Código organizado y fácil de entender
2. **Testabilidad**: Fácil testing de cada capa por separado
3. **Flexibilidad**: Fácil cambio de proveedores externos
4. **Escalabilidad**: Diseño preparado para crecimiento
5. **Seguridad**: Validación y autenticación robustas
6. **Observabilidad**: Logging y monitoring integrados

Esta arquitectura garantiza que el Xuma'a Notification Service sea robusto, mantenible y esté listo para evolucionar junto con las necesidades de la aplicación de concientización ambiental.
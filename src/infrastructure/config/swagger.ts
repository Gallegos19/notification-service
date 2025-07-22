import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Xuma\'a Notification Service API',
    version: '1.0.0',
    description: `
# 🌱 Xuma'a Notification Service

Servicio de notificaciones para la aplicación de concientización ambiental Xuma'a.

## Características
- 📧 Envío de correos electrónicos con SendGrid
- 📱 Notificaciones push con Firebase
- 🎨 Templates HTML personalizados
- 📊 Historial de notificaciones
- 🔐 Autenticación JWT

## Autenticación
Todos los endpoints requieren un token JWT Bearer en el header Authorization:
\`\`\`
Authorization: Bearer <tu_jwt_token>
\`\`\`

## Templates Disponibles
- **welcome**: Correo de bienvenida para nuevos usuarios
- **reminder**: Correos de recordatorio personalizables  
- **general**: Template genérico para cualquier contenido

## Códigos de Estado
- **200**: Operación exitosa
- **400**: Error de validación
- **401**: No autorizado
- **500**: Error interno del servidor
    `,
    contact: {
      name: 'Xuma\'a Development Team',
      email: 'dev@xumaa.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3007',
      description: 'Servidor de desarrollo'
    },
    {
      url: 'https://api.xumaa.com/notifications',
      description: 'Servidor de producción'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT para autenticación de microservicios'
      }
    },
    schemas: {
      // Schemas de request
      SendEmailRequest: {
        type: 'object',
        required: ['to', 'subject'],
        properties: {
          to: {
            type: 'string',
            format: 'email',
            description: 'Email del destinatario',
            example: 'usuario@ejemplo.com'
          },
          subject: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            description: 'Asunto del correo',
            example: '¡Bienvenido a Xuma\'a! 🌱'
          },
          templateName: {
            type: 'string',
            enum: ['welcome', 'reminder', 'general'],
            description: 'Nombre del template a usar',
            example: 'welcome'
          },
          templateData: {
            type: 'object',
            description: 'Datos para renderizar el template',
            example: {
              userName: 'Juan Pérez',
              appUrl: 'https://xumaa.com'
            }
          },
          htmlContent: {
            type: 'string',
            description: 'Contenido HTML personalizado (alternativo a template)',
            example: '<h1>¡Hola!</h1><p>Este es un mensaje personalizado.</p>'
          },
          textContent: {
            type: 'string',
            description: 'Contenido de texto plano',
            example: 'Hola! Este es un mensaje personalizado.'
          }
        }
      },
      SendPushNotificationRequest: {
        type: 'object',
        required: ['deviceToken', 'title', 'body'],
        properties: {
          deviceToken: {
            type: 'string',
            description: 'Token del dispositivo Firebase',
            example: 'dGhpc19pc19hX2ZpcmViYXNlX3Rva2Vu...'
          },
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Título de la notificación',
            example: '🌱 ¡Nueva misión disponible!'
          },
          body: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
            description: 'Cuerpo de la notificación',
            example: 'Completa tu desafío diario y gana puntos'
          },
          data: {
            type: 'object',
            description: 'Datos adicionales para la notificación',
            example: {
              type: 'challenge',
              challengeId: '123',
              points: '50'
            }
          },
          imageUrl: {
            type: 'string',
            format: 'uri',
            description: 'URL de imagen para la notificación',
            example: 'https://xumaa.com/images/challenge.jpg'
          }
        }
      },
      SendWelcomeEmailRequest: {
        type: 'object',
        required: ['to', 'userName'],
        properties: {
          to: {
            type: 'string',
            format: 'email',
            description: 'Email del nuevo usuario',
            example: 'nuevo.usuario@ejemplo.com'
          },
          userName: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Nombre del usuario',
            example: 'Juan Pérez'
          },
          appUrl: {
            type: 'string',
            format: 'uri',
            description: 'URL de la aplicación',
            example: 'https://xumaa.com'
          }
        }
      },
      SendReminderEmailRequest: {
        type: 'object',
        required: ['to', 'userName', 'reminderType'],
        properties: {
          to: {
            type: 'string',
            format: 'email',
            description: 'Email del destinatario',
            example: 'usuario@ejemplo.com'
          },
          userName: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Nombre del usuario',
            example: 'María García'
          },
          reminderType: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Tipo de recordatorio',
            example: 'Desafío pendiente'
          },
          reminderMessage: {
            type: 'string',
            maxLength: 500,
            description: 'Mensaje personalizado del recordatorio',
            example: 'Tienes un desafío de reciclaje esperándote'
          },
          ecoFact: {
            type: 'string',
            maxLength: 500,
            description: 'Dato ecológico interesante',
            example: '¿Sabías que reciclar una tonelada de papel salva 17 árboles?'
          },
          appUrl: {
            type: 'string',
            format: 'uri',
            description: 'URL de la aplicación',
            example: 'https://xumaa.com/challenges'
          }
        }
      },
      // Schemas de response
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Operation completed successfully'
          },
          notificationId: {
            type: 'string',
            description: 'ID único de la notificación enviada',
            example: 'clp1234567890abcdef'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Validation error'
          },
          message: {
            type: 'string',
            example: 'El email debe tener un formato válido'
          }
        }
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'OK'
          },
          service: {
            type: 'string',
            example: 'Xuma\'a Notification Service'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z'
          },
          version: {
            type: 'string',
            example: '1.0.0'
          }
        }
      },
      NotificationHistory: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único de la notificación',
            example: 'clp1234567890abcdef'
          },
          type: {
            type: 'string',
            enum: ['EMAIL', 'PUSH_NOTIFICATION'],
            description: 'Tipo de notificación',
            example: 'EMAIL'
          },
          recipient: {
            type: 'string',
            description: 'Destinatario de la notificación',
            example: 'usuario@ejemplo.com'
          },
          subject: {
            type: 'string',
            description: 'Asunto (solo para emails)',
            example: 'Bienvenido a Xuma\'a'
          },
          content: {
            type: 'string',
            description: 'Contenido de la notificación',
            example: '<html>...</html>'
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'SENT', 'FAILED', 'DELIVERED'],
            description: 'Estado de la notificación',
            example: 'SENT'
          },
          sentAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora de envío',
            example: '2024-01-15T10:30:00.000Z'
          },
          errorMessage: {
            type: 'string',
            description: 'Mensaje de error (si falló)',
            example: null
          },
          metadata: {
            type: 'object',
            description: 'Metadatos adicionales',
            example: {
              templateType: 'welcome',
              sentBy: 'auth-service'
            }
          }
        }
      },
      HistoryResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/NotificationHistory'
            }
          },
          count: {
            type: 'integer',
            description: 'Número de notificaciones retornadas',
            example: 10
          }
        }
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ],
  tags: [
    {
      name: 'Health',
      description: '🏥 Endpoints de salud del servicio'
    },
    {
      name: 'Email',
      description: '📧 Endpoints para envío de correos electrónicos'
    },
    {
      name: 'Push Notifications',
      description: '📱 Endpoints para notificaciones push'
    },
    {
      name: 'History',
      description: '📊 Endpoints para consultar historial de notificaciones'
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/infrastructure/web/routes/*.ts',
    './src/infrastructure/web/controllers/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
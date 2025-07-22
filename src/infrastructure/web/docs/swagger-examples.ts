// Ejemplos adicionales para la documentación de Swagger

export const swaggerExamples = {
  // Ejemplos de requests exitosos
  emailExamples: {
    welcomeEmail: {
      summary: "Correo de bienvenida completo",
      description: "Ejemplo de correo de bienvenida con todos los campos",
      value: {
        to: "nuevo.usuario@xumaa.com",
        userName: "Ana García",
        appUrl: "https://xumaa.com/dashboard"
      }
    },
    reminderEmail: {
      summary: "Recordatorio de desafío",
      description: "Recordatorio para completar un desafío ambiental",
      value: {
        to: "usuario.activo@xumaa.com",
        userName: "Carlos Mendoza",
        reminderType: "Desafío de ahorro de agua",
        reminderMessage: "¡No olvides completar tu desafío diario! Cada gota cuenta para nuestro planeta.",
        ecoFact: "Una ducha de 5 minutos consume aproximadamente 95 litros de agua. ¡Reduce tu tiempo y ayuda al planeta!",
        appUrl: "https://xumaa.com/challenges/water-saving"
      }
    },
    customEmail: {
      summary: "Email personalizado con HTML",
      description: "Email con contenido HTML personalizado",
      value: {
        to: "usuario@xumaa.com",
        subject: "🏆 ¡Felicidades por tu logro ambiental!",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">¡Increíble trabajo! 🎉</h2>
            <p>Has completado <strong>10 desafíos ambientales</strong> este mes.</p>
            <div style="background: #f0f8f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Tu impacto ambiental:</h3>
              <ul>
                <li>🌊 Ahorraste 500 litros de agua</li>
                <li>♻️ Reciclaste 15 kg de materiales</li>
                <li>🌱 Redujiste 25 kg de CO₂</li>
                <li>⚡ Ahorraste 50 kWh de energía</li>
              </ul>
            </div>
            <p>¡Sigue así y ayuda a salvar nuestro planeta! 🌍</p>
          </div>
        `,
        textContent: "¡Increíble trabajo! Has completado 10 desafíos ambientales este mes. Tu impacto: 500L agua ahorrada, 15kg reciclados, 25kg CO₂ reducidos."
      }
    }
  },

  pushExamples: {
    challengeNotification: {
      summary: "Notificación de nuevo desafío",
      description: "Notifica sobre un nuevo desafío disponible",
      value: {
        deviceToken: "dGhpc19pc19hX2ZpcmViYXNlX3Rva2VuX2V4YW1wbGU...",
        title: "🌱 ¡Nueva misión disponible!",
        body: "Completa el desafío de reciclaje y gana 100 puntos",
        data: {
          type: "challenge",
          challengeId: "recycling-challenge-001",
          points: "100",
          category: "recycling",
          difficulty: "medium"
        },
        imageUrl: "https://xumaa.com/images/challenges/recycling.jpg"
      }
    },
    achievementNotification: {
      summary: "Notificación de logro desbloqueado",
      description: "Notifica cuando el usuario desbloquea un nuevo logro",
      value: {
        deviceToken: "dGhpc19pc19hX2ZpcmViYXNlX3Rva2VuX2V4YW1wbGU...",
        title: "🏆 ¡Logro desbloqueado!",
        body: "Has obtenido la insignia 'Eco Guerrero'",
        data: {
          type: "achievement",
          achievementId: "eco-warrior",
          badgeIcon: "eco-warrior-badge",
          points: "250"
        },
        imageUrl: "https://xumaa.com/images/badges/eco-warrior.png"
      }
    },
    reminderNotification: {
      summary: "Recordatorio de actividad",
      description: "Recordatorio para usuarios inactivos",
      value: {
        deviceToken: "dGhpc19pc19hX2ZpcmViYXNlX3Rva2VuX2V4YW1wbGU...",
        title: "🌍 ¡Te extrañamos!",
        body: "Han pasado 3 días. Tu mascota virtual Dexter te está esperando",
        data: {
          type: "reminder",
          reminderType: "inactivity",
          daysInactive: "3",
          petName: "Dexter"
        },
        imageUrl: "https://xumaa.com/images/pets/dexter-sad.jpg"
      }
    },
    petNotification: {
      summary: "Notificación de mascota virtual",
      description: "Notificación relacionada con la mascota virtual del usuario",
      value: {
        deviceToken: "dGhpc19pc19hX2ZpcmViYXNlX3Rva2VuX2V4YW1wbGU...",
        title: "🐾 ¡Tu mascota necesita atención!",
        body: "Elly está hambrienta. Completa un desafío para alimentarla",
        data: {
          type: "pet",
          petId: "elly-001",
          petName: "Elly",
          action: "feed",
          hungerLevel: "80"
        },
        imageUrl: "https://xumaa.com/images/pets/elly-hungry.jpg"
      }
    }
  },

  // Ejemplos de respuestas
  responseExamples: {
    successResponse: {
      summary: "Respuesta exitosa",
      value: {
        success: true,
        message: "Email sent successfully",
        notificationId: "clp1234567890abcdef"
      }
    },
    validationError: {
      summary: "Error de validación",
      value: {
        error: "Validation error",
        message: "El email debe tener un formato válido"
      }
    },
    authError: {
      summary: "Error de autenticación",
      value: {
        error: "Access denied",
        message: "Invalid token"
      }
    },
    serverError: {
      summary: "Error interno del servidor",
      value: {
        error: "Internal server error",
        message: "Failed to send notification"
      }
    }
  },

  // Ejemplos de historial
  historyExamples: {
    emailHistory: {
      summary: "Historial de emails",
      value: {
        success: true,
        data: [
          {
            id: "clp1234567890abcdef",
            type: "EMAIL",
            recipient: "usuario@ejemplo.com",
            subject: "¡Bienvenido a Xuma'a!",
            content: "<html>...</html>",
            status: "SENT",
            sentAt: "2024-01-15T10:30:00.000Z",
            errorMessage: null,
            metadata: {
              templateType: "welcome",
              sentBy: "auth-service"
            }
          }
        ],
        count: 1
      }
    },
    pushHistory: {
      summary: "Historial de push notifications",
      value: {
        success: true,
        data: [
          {
            id: "clp0987654321fedcba",
            type: "PUSH_NOTIFICATION",
            recipient: "dGhpc19pc19hX2ZpcmViYXNlX3Rva2Vu...",
            subject: null,
            content: '{"title":"¡Nueva misión!","body":"Completa tu desafío"}',
            status: "SENT",
            sentAt: "2024-01-15T11:00:00.000Z",
            errorMessage: null,
            metadata: {
              deviceType: "android",
              sentBy: "gamification-service"
            }
          }
        ],
        count: 1
      }
    }
  }
};

// Configuración adicional para Swagger UI
export const swaggerUIConfig = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { 
      color: #4CAF50; 
      font-size: 2.5em;
    }
    .swagger-ui .info .description { 
      font-size: 1.1em; 
      line-height: 1.6;
    }
    .swagger-ui .scheme-container { 
      background: linear-gradient(135deg, #f0f8f0, #e8f5e8); 
      border-radius: 10px;
      padding: 15px;
    }
    .swagger-ui .opblock.opblock-post { 
      border-color: #4CAF50; 
    }
    .swagger-ui .opblock.opblock-get { 
      border-color: #2196F3; 
    }
    .swagger-ui .opblock-summary { 
      font-weight: bold; 
    }
    .swagger-ui .btn.authorize { 
      background-color: #4CAF50; 
      border-color: #4CAF50; 
    }
    .swagger-ui .btn.authorize:hover { 
      background-color: #45a049; 
    }
  `,
  customSiteTitle: 'Xuma\'a Notification Service API',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2
  }
};
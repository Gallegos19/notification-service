import Joi from 'joi';

export const sendEmailSchema = Joi.object({
  to: Joi.string().email().required().messages({
    'string.email': 'El email debe tener un formato válido',
    'any.required': 'El email del destinatario es requerido'
  }),
  subject: Joi.string().min(1).max(200).required().messages({
    'string.min': 'El asunto no puede estar vacío',
    'string.max': 'El asunto no puede exceder 200 caracteres',
    'any.required': 'El asunto es requerido'
  }),
  templateName: Joi.string().valid('welcome', 'reminder', 'general').optional(),
  templateData: Joi.object().optional(),
  htmlContent: Joi.string().optional(),
  textContent: Joi.string().optional()
}).or('templateName', 'htmlContent').messages({
  'object.missing': 'Debe proporcionar templateName o htmlContent'
});

export const sendPushNotificationSchema = Joi.object({
  deviceToken: Joi.string().required().messages({
    'any.required': 'El token del dispositivo es requerido'
  }),
  title: Joi.string().min(1).max(100).required().messages({
    'string.min': 'El título no puede estar vacío',
    'string.max': 'El título no puede exceder 100 caracteres',
    'any.required': 'El título es requerido'
  }),
  body: Joi.string().min(1).max(500).required().messages({
    'string.min': 'El cuerpo no puede estar vacío',
    'string.max': 'El cuerpo no puede exceder 500 caracteres',
    'any.required': 'El cuerpo es requerido'
  }),
  data: Joi.object().optional(),
  imageUrl: Joi.string().uri().optional().messages({
    'string.uri': 'La URL de la imagen debe ser válida'
  })
});

export const sendWelcomeEmailSchema = Joi.object({
  to: Joi.string().email().required().messages({
    'string.email': 'El email debe tener un formato válido',
    'any.required': 'El email del destinatario es requerido'
  }),
  userName: Joi.string().min(1).max(100).required().messages({
    'string.min': 'El nombre de usuario no puede estar vacío',
    'string.max': 'El nombre de usuario no puede exceder 100 caracteres',
    'any.required': 'El nombre de usuario es requerido'
  }),
  appUrl: Joi.string().uri().optional().messages({
    'string.uri': 'La URL de la aplicación debe ser válida'
  })
});

export const sendReminderEmailSchema = Joi.object({
  to: Joi.string().email().required().messages({
    'string.email': 'El email debe tener un formato válido',
    'any.required': 'El email del destinatario es requerido'
  }),
  userName: Joi.string().min(1).max(100).required().messages({
    'string.min': 'El nombre de usuario no puede estar vacío',
    'string.max': 'El nombre de usuario no puede exceder 100 caracteres',
    'any.required': 'El nombre de usuario es requerido'
  }),
  reminderType: Joi.string().min(1).max(100).required().messages({
    'string.min': 'El tipo de recordatorio no puede estar vacío',
    'string.max': 'El tipo de recordatorio no puede exceder 100 caracteres',
    'any.required': 'El tipo de recordatorio es requerido'
  }),
  reminderMessage: Joi.string().max(500).optional().messages({
    'string.max': 'El mensaje de recordatorio no puede exceder 500 caracteres'
  }),
  ecoFact: Joi.string().max(500).optional().messages({
    'string.max': 'El dato ecológico no puede exceder 500 caracteres'
  }),
  appUrl: Joi.string().uri().optional().messages({
    'string.uri': 'La URL de la aplicación debe ser válida'
  })
});

export const getHistorySchema = Joi.object({
  recipient: Joi.string().email().optional().messages({
    'string.email': 'El email debe tener un formato válido'
  }),
  limit: Joi.number().integer().min(1).max(100).optional().messages({
    'number.integer': 'El límite debe ser un número entero',
    'number.min': 'El límite debe ser al menos 1',
    'number.max': 'El límite no puede exceder 100'
  }),
  offset: Joi.number().integer().min(0).optional().messages({
    'number.integer': 'El offset debe ser un número entero',
    'number.min': 'El offset debe ser al menos 0'
  })
});
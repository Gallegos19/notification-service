import { Request, Response } from "express";
import { SendEmailUseCase } from "../../../application/use-cases/SendEmailUseCase";
import { SendPushNotificationUseCase } from "../../../application/use-cases/SendPushNotificationUseCase";
import { GetNotificationHistoryUseCase } from "../../../application/use-cases/GetNotificationHistoryUseCase";
import { AuthenticatedRequest } from "../../security/AuthMiddleware";
import {
  sendEmailSchema,
  sendPushNotificationSchema,
  sendWelcomeEmailSchema,
  sendReminderEmailSchema,
  getHistorySchema,
} from "../validators/NotificationValidators";
import Joi from "joi";

export class NotificationController {
  constructor(
    private readonly sendEmailUseCase: SendEmailUseCase,
    private readonly sendPushNotificationUseCase: SendPushNotificationUseCase,
    private readonly getNotificationHistoryUseCase: GetNotificationHistoryUseCase
  ) {}

  sendEmail = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { error, value } = sendEmailSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
        });
        return;
      }

      const {
        to,
        subject,
        templateName,
        templateData,
        htmlContent,
        textContent,
      } = value;

      const notificationId = await this.sendEmailUseCase.execute({
        to,
        subject,
        templateName,
        templateData,
        htmlContent,
        textContent,
        metadata: {
          sentBy: req.user?.id,
          timestamp: new Date().toISOString(),
        },
      });

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
        notificationId,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to send email",
      });
    }
  };

  sendPushNotification = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { error, value } = sendPushNotificationSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
        });
        return;
      }

      const { deviceToken, title, body, data, imageUrl } = value;

      const notificationId = await this.sendPushNotificationUseCase.execute({
        deviceToken,
        title,
        body,
        data,
        imageUrl,
        metadata: {
          sentBy: req.user?.id,
          timestamp: new Date().toISOString(),
        },
      });

      res.status(200).json({
        success: true,
        message: "Push notification sent successfully",
        notificationId,
      });
    } catch (error) {
      console.error("Error sending push notification:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to send push notification",
      });
    }
  };

  getHistory = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { error, value } = getHistorySchema.validate(req.query);
      if (error) {
        res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
        });
        return;
      }

      const { recipient, limit, offset } = value;

      const notifications = await this.getNotificationHistoryUseCase.execute({
        recipient,
        limit,
        offset,
      });

      res.status(200).json({
        success: true,
        data: notifications,
        count: notifications.length,
      });
    } catch (error) {
      console.error("Error getting notification history:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to get notification history",
      });
    }
  };

  // Endpoint específico para correos de bienvenida
  sendWelcomeEmail = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { error, value } = sendWelcomeEmailSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
        });
        return;
      }

      const { to, userName, appUrl } = value;

      const notificationId = await this.sendEmailUseCase.execute({
        to,
        subject: "¡Bienvenido a Xuma'a! 🌱",
        templateName: "welcome",
        templateData: {
          userName,
          appUrl: appUrl || "https://xumaa.com",
        },
        metadata: {
          type: "welcome",
          sentBy: req.user?.id,
          timestamp: new Date().toISOString(),
        },
      });

      res.status(200).json({
        success: true,
        message: "Welcome email sent successfully",
        notificationId,
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to send welcome email",
      });
    }
  };

  // Endpoint específico para correos de recordatorio
  sendReminderEmail = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { error, value } = sendReminderEmailSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
        });
        return;
      }

      const { to, userName, reminderType, reminderMessage, ecoFact, appUrl } =
        value;

      const notificationId = await this.sendEmailUseCase.execute({
        to,
        subject: "¡No olvides tu misión ambiental! 🌍",
        templateName: "reminder",
        templateData: {
          userName,
          reminderType,
          reminderMessage:
            reminderMessage || "Es hora de continuar tu aventura ambiental",
          ecoFact:
            ecoFact ||
            "Una sola persona puede ahorrar hasta 1,000 litros de agua al día con pequeños cambios.",
          appUrl: appUrl || "https://xumaa.com",
        },
        metadata: {
          type: "reminder",
          reminderType,
          sentBy: req.user?.id,
          timestamp: new Date().toISOString(),
        },
      });

      res.status(200).json({
        success: true,
        message: "Reminder email sent successfully",
        notificationId,
      });
    } catch (error) {
      console.error("Error sending reminder email:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to send reminder email",
      });
    }
  };

  // Endpoint específico para confirmación de correo electrónico
  sendEmailConfirmation = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const confirmationSchema = Joi.object({
        to: Joi.string().email().required().messages({
          "string.email": "El email debe tener un formato válido",
          "any.required": "El email del destinatario es requerido",
        }),
        userName: Joi.string().min(1).max(100).required().messages({
          "string.min": "El nombre de usuario no puede estar vacío",
          "string.max": "El nombre de usuario no puede exceder 100 caracteres",
          "any.required": "El nombre de usuario es requerido",
        }),
        token: Joi.string().required().messages({
          "any.required": "El token de confirmación es requerido",
        }),
        baseUrl: Joi.string()
          .uri()
          .optional()
          .default("https://xumaa.com")
          .messages({
            "string.uri": "La URL base debe ser válida",
          }),
        expirationHours: Joi.number()
          .integer()
          .min(1)
          .max(72)
          .optional()
          .default(24)
          .messages({
            "number.integer":
              "Las horas de expiración deben ser un número entero",
            "number.min": "Las horas de expiración deben ser al menos 1",
            "number.max": "Las horas de expiración no pueden exceder 72",
          }),
      });

      const { error, value } = confirmationSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: "Validation error",
          message: error.details[0].message,
        });
        return;
      }

      const { to, userName, token, baseUrl, expirationHours } = value;

      // Construir la URL de confirmación con el token
      const confirmationUrl = `${baseUrl}/confirm-email?token=${token}`;

      // Calcular tiempo de expiración
      const expirationTime =
        expirationHours === 24
          ? "24 horas"
          : expirationHours === 1
            ? "1 hora"
            : `${expirationHours} horas`;

      const notificationId = await this.sendEmailUseCase.execute({
        to,
        subject: "📧 Confirma tu correo electrónico - Xuma'a",
        templateName: "email-confirmation",
        templateData: {
          userName,
          confirmationUrl,
          expirationTime,
          baseUrl,
        },
        metadata: {
          type: "email_confirmation",
          token,
          expirationHours,
          sentBy: req.user?.id,
          timestamp: new Date().toISOString(),
        },
      });

      res.status(200).json({
        success: true,
        message: "Email confirmation sent successfully",
        notificationId,
        confirmationUrl,
        expiresIn: `${expirationHours} hours`,
      });
    } catch (error) {
      console.error("Error sending email confirmation:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to send email confirmation",
      });
    }
  };
}

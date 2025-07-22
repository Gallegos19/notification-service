import { Request, Response } from 'express';
import { SendPushNotificationUseCase } from '../../../application/use-cases/SendPushNotificationUseCase';
import { AuthenticatedRequest } from '../../security/AuthMiddleware';
import Joi from 'joi';

const sendPushSchema = Joi.object({
  deviceToken: Joi.string().required(),
  title: Joi.string().min(1).max(100).required(),
  body: Joi.string().min(1).max(500).required(),
  data: Joi.object().optional(),
  imageUrl: Joi.string().uri().optional()
});

const sendMultiplePushSchema = Joi.object({
  tokens: Joi.array().items(Joi.string()).min(1).max(1000).required(),
  title: Joi.string().min(1).max(100).required(),
  body: Joi.string().min(1).max(500).required(),
  data: Joi.object().optional(),
  imageUrl: Joi.string().uri().optional(),
  priority: Joi.string().valid('low', 'normal', 'high').optional().default('normal')
});

export class PushNotificationController {
  constructor(private readonly sendPushNotificationUseCase: SendPushNotificationUseCase) {}

  sendPushNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { error, value } = sendPushSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(d => d.message)
        });
        return;
      }

      const notificationId = await this.sendPushNotificationUseCase.execute(value);

      res.status(200).json({
        success: true,
        message: 'Push notification sent successfully',
        notificationId
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to send push notification'
      });
    }
  };

  // Endpoint para notificaciones de logros/badges
  sendAchievementNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const achievementSchema = Joi.object({
        token: Joi.string().required(),
        achievementName: Joi.string().required(),
        achievementDescription: Joi.string().required(),
        userName: Joi.string().required(),
        badgeIcon: Joi.string().valid('dexter', 'elly', 'paxoloth', 'yami').optional()
      });

      const { error, value } = achievementSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(d => d.message)
        });
        return;
      }

      const notificationId = await this.sendPushNotificationUseCase.execute({
        deviceToken: value.token,
        title: `¡Felicidades ${value.userName}! 🎉`,
        body: `Has desbloqueado: ${value.achievementName}`,
        data: {
          type: 'achievement',
          achievementName: value.achievementName,
          achievementDescription: value.achievementDescription
        },
        imageUrl: value.badgeIcon ? `https://yourapp.com/assets/${value.badgeIcon}-icon.jpg` : undefined,
        metadata: {
          priority: 'high'
        }
      });

      res.status(200).json({
        success: true,
        message: 'Achievement notification sent successfully',
        notificationId
      });
    } catch (error) {
      console.error('Error sending achievement notification:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to send achievement notification'
      });
    }
  };

  // Endpoint para recordatorios de quiz
  sendQuizReminder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const quizReminderSchema = Joi.object({
        token: Joi.string().required(),
        userName: Joi.string().required(),
        quizTitle: Joi.string().optional(),
        daysInactive: Joi.number().optional()
      });

      const { error, value } = quizReminderSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          error: 'Validation error',
          details: error.details.map(d => d.message)
        });
        return;
      }

      const title = value.quizTitle 
        ? `¡Nuevo quiz disponible! 📚`
        : `¡Te extrañamos ${value.userName}! 🌱`;
      
      const body = value.quizTitle
        ? `Pon a prueba tus conocimientos con: ${value.quizTitle}`
        : `Han pasado ${value.daysInactive || 3} días. ¡Vuelve a aprender sobre el medio ambiente!`;

      const notificationId = await this.sendPushNotificationUseCase.execute({
        deviceToken: value.token,
        title,
        body,
        data: {
          type: 'quiz_reminder',
          quizTitle: value.quizTitle || '',
          daysInactive: String(value.daysInactive || 0)
        },
        metadata: {
          priority: 'normal'
        }
      });

      res.status(200).json({
        success: true,
        message: 'Quiz reminder sent successfully',
        notificationId
      });
    } catch (error) {
      console.error('Error sending quiz reminder:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to send quiz reminder'
      });
    }
  };
}
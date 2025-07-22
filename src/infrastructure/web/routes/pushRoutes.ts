import { Router } from 'express';
import { PushNotificationController } from '../controllers/PushNotificationController';
import { AuthMiddleware } from '../../security/AuthMiddleware';

export function createPushRoutes(
  pushController: PushNotificationController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Enviar push notification genérica
  router.post('/send', authMiddleware.authenticateService, pushController.sendPushNotification);

  // Enviar notificación de logro
  router.post('/send-achievement', authMiddleware.authenticateService, pushController.sendAchievementNotification);

  // Enviar recordatorio de quiz
  router.post('/send-quiz-reminder', authMiddleware.authenticateService, pushController.sendQuizReminder);

  return router;
}
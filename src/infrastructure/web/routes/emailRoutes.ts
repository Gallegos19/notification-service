import { Router } from 'express';
import { EmailController } from '../controllers/EmailController';
import { AuthMiddleware } from '../../security/AuthMiddleware';

export function createEmailRoutes(
  emailController: EmailController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Enviar email genérico
  router.post('/send', authMiddleware.authenticateService, emailController.sendEmail);

  // Enviar recordatorio
  router.post('/send-reminder', authMiddleware.authenticateService, emailController.sendReminder);

  return router;
}
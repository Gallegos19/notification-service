import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { AuthMiddleware } from '../../security/AuthMiddleware';

/**
 * @swagger
 * /api/notifications/email:
 *   post:
 *     tags: [Email]
 *     summary: 📧 Enviar correo electrónico
 *     description: Envía un correo electrónico usando un template o contenido HTML personalizado
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendEmailRequest'
 *           examples:
 *             template:
 *               summary: Usando template
 *               value:
 *                 to: "usuario@ejemplo.com"
 *                 subject: "¡Mensaje de Xuma'a!"
 *                 templateName: "general"
 *                 templateData:
 *                   content: "<h2>¡Hola!</h2><p>Este es un mensaje de Xuma'a</p>"
 *             custom:
 *               summary: HTML personalizado
 *               value:
 *                 to: "usuario@ejemplo.com"
 *                 subject: "Mensaje personalizado"
 *                 htmlContent: "<h1>¡Hola!</h1><p>Contenido personalizado</p>"
 *                 textContent: "Hola! Contenido personalizado"
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/notifications/push:
 *   post:
 *     tags: [Push Notifications]
 *     summary: 📱 Enviar notificación push
 *     description: Envía una notificación push a un dispositivo específico usando Firebase
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendPushNotificationRequest'
 *           examples:
 *             challenge:
 *               summary: Notificación de desafío
 *               value:
 *                 deviceToken: "dGhpc19pc19hX2ZpcmViYXNlX3Rva2Vu..."
 *                 title: "🌱 ¡Nueva misión disponible!"
 *                 body: "Completa tu desafío diario de ahorro de agua"
 *                 data:
 *                   type: "challenge"
 *                   challengeId: "123"
 *                   points: "50"
 *                 imageUrl: "https://xumaa.com/images/water-challenge.jpg"
 *             achievement:
 *               summary: Notificación de logro
 *               value:
 *                 deviceToken: "dGhpc19pc19hX2ZpcmViYXNlX3Rva2Vu..."
 *                 title: "🏆 ¡Felicidades!"
 *                 body: "Has desbloqueado un nuevo logro"
 *                 data:
 *                   type: "achievement"
 *                   achievementId: "eco-warrior"
 *     responses:
 *       200:
 *         description: Notificación enviada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/notifications/email/welcome:
 *   post:
 *     tags: [Email]
 *     summary: 🎉 Enviar correo de bienvenida
 *     description: Envía un correo de bienvenida personalizado para nuevos usuarios de Xuma'a
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendWelcomeEmailRequest'
 *           example:
 *             to: "nuevo.usuario@ejemplo.com"
 *             userName: "Juan Pérez"
 *             appUrl: "https://xumaa.com"
 *     responses:
 *       200:
 *         description: Correo de bienvenida enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/notifications/email/reminder:
 *   post:
 *     tags: [Email]
 *     summary: ⏰ Enviar correo de recordatorio
 *     description: Envía un correo de recordatorio personalizable para usuarios inactivos
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendReminderEmailRequest'
 *           example:
 *             to: "usuario@ejemplo.com"
 *             userName: "María García"
 *             reminderType: "Desafío pendiente"
 *             reminderMessage: "Tienes un desafío de reciclaje esperándote"
 *             ecoFact: "¿Sabías que reciclar una tonelada de papel salva 17 árboles?"
 *             appUrl: "https://xumaa.com/challenges"
 *     responses:
 *       200:
 *         description: Correo de recordatorio enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/notifications/email/confirmation:
 *   post:
 *     tags: [Email]
 *     summary: 📧 Enviar confirmación de correo electrónico
 *     description: Envía un correo de confirmación con un enlace que incluye un token para verificar la dirección de email
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - userName
 *               - token
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 description: Dirección de correo electrónico del destinatario
 *                 example: "usuario@ejemplo.com"
 *               userName:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Nombre del usuario para personalizar el correo
 *                 example: "Juan Pérez"
 *               token:
 *                 type: string
 *                 description: Token de confirmación único generado por el sistema
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               baseUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL base del sitio web (opcional)
 *                 default: "https://xumaa.com"
 *                 example: "https://xumaa.com"
 *               expirationHours:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 72
 *                 description: Horas hasta que expire el enlace de confirmación (opcional)
 *                 default: 24
 *                 example: 24
 *           example:
 *             to: "nuevo.usuario@ejemplo.com"
 *             userName: "Juan Pérez"
 *             token: "abc123def456ghi789"
 *             baseUrl: "https://xumaa.com"
 *             expirationHours: 24
 *     responses:
 *       200:
 *         description: Correo de confirmación enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email confirmation sent successfully"
 *                 notificationId:
 *                   type: string
 *                   example: "clp1234567890abcdef"
 *                 confirmationUrl:
 *                   type: string
 *                   example: "https://xumaa.com/confirm-email?token=abc123def456ghi789"
 *                 expiresIn:
 *                   type: string
 *                   example: "24 hours"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/notifications/history:
 *   get:
 *     tags: [History]
 *     summary: 📊 Obtener historial de notificaciones
 *     description: Consulta el historial de notificaciones enviadas con filtros opcionales
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: recipient
 *         schema:
 *           type: string
 *           format: email
 *         description: Filtrar por destinatario específico
 *         example: "usuario@ejemplo.com"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Número máximo de resultados
 *         example: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de resultados a omitir
 *         example: 0
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoryResponse'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

export function createNotificationRoutes(
  notificationController: NotificationController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Rutas para envío de notificaciones (requieren autenticación)
  router.post('/email', authMiddleware.authenticateService, notificationController.sendEmail);
  router.post('/push', authMiddleware.authenticateService, notificationController.sendPushNotification);
  
  // Rutas específicas para tipos de correo
  router.post('/email/welcome', authMiddleware.authenticateService, notificationController.sendWelcomeEmail);
  router.post('/email/reminder', authMiddleware.authenticateService, notificationController.sendReminderEmail);
  router.post('/email/confirmation', authMiddleware.authenticateService, notificationController.sendEmailConfirmation);
  
  // Ruta alternativa para servicios internos (más específica)
  router.post('/internal/email/confirmation', authMiddleware.authenticateService, notificationController.sendEmailConfirmation);
  router.post('internal/email/welcome',authMiddleware.authenticateService,notificationController.sendWelcomeEmail);
  router.post('internal/email/reminder', authMiddleware.authenticateService, notificationController.sendReminderEmail);
  
  router.post('internal/email', authMiddleware.authenticateService, notificationController.sendEmail);
  router.post('internal/push', authMiddleware.authenticateService, notificationController.sendPushNotification);
  
  // Ruta para historial (requiere autenticación de usuario o servicio)
  router.get('/history', authMiddleware.authenticate, notificationController.getHistory);

  return router;
}
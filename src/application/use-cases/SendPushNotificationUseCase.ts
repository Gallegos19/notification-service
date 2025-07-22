import { Notification } from '../../domain/entities/Notification';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { PushNotificationService } from '../ports/PushNotificationService';
import { v4 as uuidv4 } from 'uuid';

export interface SendPushNotificationRequest {
  deviceToken: string;
  title: string;
  body: string;
  data?: { [key: string]: string };
  imageUrl?: string;
  metadata?: { [key: string]: any };
}

export class SendPushNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly pushNotificationService: PushNotificationService
  ) {}

  async execute(request: SendPushNotificationRequest): Promise<string> {
    const notificationId = uuidv4();
    
    try {
      // Create notification entity
      const notification = Notification.createPushNotification(
        notificationId,
        request.deviceToken,
        JSON.stringify({ title: request.title, body: request.body }),
        request.metadata
      );

      // Save as pending
      await this.notificationRepository.save(notification);

      // Send push notification
      await this.pushNotificationService.sendNotification({
        deviceToken: request.deviceToken,
        title: request.title,
        body: request.body,
        data: request.data,
        imageUrl: request.imageUrl
      });

      // Update as sent
      const sentNotification = notification.markAsSent();
      await this.notificationRepository.save(sentNotification);

      return notificationId;
    } catch (error) {
      // Mark as failed
      const notification = Notification.createPushNotification(
        notificationId,
        request.deviceToken,
        JSON.stringify({ title: request.title, body: request.body }),
        request.metadata
      );
      
      const failedNotification = notification.markAsFailed(
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      await this.notificationRepository.save(failedNotification);
      throw error;
    }
  }
}
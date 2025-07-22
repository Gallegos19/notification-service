import * as admin from 'firebase-admin';
import { PushNotificationService, PushNotificationData } from '../../application/ports/PushNotificationService';

export class FirebasePushNotificationService implements PushNotificationService {
  private app: admin.app.App;

  constructor(serviceAccountPath: string, projectId: string) {
    const serviceAccount = require(serviceAccountPath);
    
    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId
    });
  }

  async sendNotification(notificationData: PushNotificationData): Promise<void> {
    const message: admin.messaging.Message = {
      token: notificationData.deviceToken,
      notification: {
        title: notificationData.title,
        body: notificationData.body,
        imageUrl: notificationData.imageUrl
      },
      data: notificationData.data,
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#4CAF50', // Verde para Xuma'a
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw new Error(`Failed to send push notification: ${error.message}`);
    }
  }
}
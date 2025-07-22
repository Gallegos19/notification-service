export interface PushNotificationData {
  deviceToken: string;
  title: string;
  body: string;
  data?: { [key: string]: string };
  imageUrl?: string;
}

export interface PushNotificationService {
  sendNotification(notificationData: PushNotificationData): Promise<void>;
}
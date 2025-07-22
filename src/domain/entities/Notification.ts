export enum NotificationType {
  EMAIL = 'EMAIL',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED'
}

export interface NotificationMetadata {
  deviceToken?: string;
  templateType?: string;
  userId?: string;
  [key: string]: any;
}

export class Notification {
  constructor(
    public readonly id: string,
    public readonly type: NotificationType,
    public readonly recipient: string,
    public readonly content: string,
    public readonly subject?: string,
    public readonly status: NotificationStatus = NotificationStatus.PENDING,
    public readonly sentAt?: Date,
    public readonly errorMessage?: string,
    public readonly metadata?: NotificationMetadata
  ) {}

  static createEmail(
    id: string,
    recipient: string,
    subject: string,
    content: string,
    metadata?: NotificationMetadata
  ): Notification {
    return new Notification(
      id,
      NotificationType.EMAIL,
      recipient,
      content,
      subject,
      NotificationStatus.PENDING,
      undefined,
      undefined,
      metadata
    );
  }

  static createPushNotification(
    id: string,
    deviceToken: string,
    content: string,
    metadata?: NotificationMetadata
  ): Notification {
    return new Notification(
      id,
      NotificationType.PUSH_NOTIFICATION,
      deviceToken,
      content,
      undefined,
      NotificationStatus.PENDING,
      undefined,
      undefined,
      { ...metadata, deviceToken }
    );
  }

  markAsSent(): Notification {
    return new Notification(
      this.id,
      this.type,
      this.recipient,
      this.content,
      this.subject,
      NotificationStatus.SENT,
      new Date(),
      this.errorMessage,
      this.metadata
    );
  }

  markAsFailed(errorMessage: string): Notification {
    return new Notification(
      this.id,
      this.type,
      this.recipient,
      this.content,
      this.subject,
      NotificationStatus.FAILED,
      new Date(),
      errorMessage,
      this.metadata
    );
  }
}
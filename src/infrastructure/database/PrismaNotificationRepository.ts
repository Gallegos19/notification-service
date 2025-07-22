import { PrismaClient } from '@prisma/client';
import { Notification, NotificationType, NotificationStatus } from '../../domain/entities/Notification';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(notification: Notification): Promise<void> {
    await this.prisma.notificationHistory.upsert({
      where: { id: notification.id },
      update: {
        status: notification.status,
        sentAt: notification.sentAt,
        errorMessage: notification.errorMessage,
        metadata: notification.metadata as any
      },
      create: {
        id: notification.id,
        type: notification.type,
        recipient: notification.recipient,
        subject: notification.subject,
        content: notification.content,
        status: notification.status,
        sentAt: notification.sentAt,
        errorMessage: notification.errorMessage,
        metadata: notification.metadata as any
      }
    });
  }

  async findById(id: string): Promise<Notification | null> {
    const record = await this.prisma.notificationHistory.findUnique({
      where: { id }
    });

    if (!record) return null;

    return new Notification(
      record.id,
      record.type as NotificationType,
      record.recipient,
      record.content,
      record.subject || undefined,
      record.status as NotificationStatus,
      record.sentAt,
      record.errorMessage || undefined,
      record.metadata as any
    );
  }

  async findByRecipient(recipient: string, limit = 50): Promise<Notification[]> {
    const records = await this.prisma.notificationHistory.findMany({
      where: { recipient },
      orderBy: { sentAt: 'desc' },
      take: limit
    });

    return records.map(record => new Notification(
      record.id,
      record.type as NotificationType,
      record.recipient,
      record.content,
      record.subject || undefined,
      record.status as NotificationStatus,
      record.sentAt,
      record.errorMessage || undefined,
      record.metadata as any
    ));
  }

  async findAll(limit = 50, offset = 0): Promise<Notification[]> {
    const records = await this.prisma.notificationHistory.findMany({
      orderBy: { sentAt: 'desc' },
      take: limit,
      skip: offset
    });

    return records.map(record => new Notification(
      record.id,
      record.type as NotificationType,
      record.recipient,
      record.content,
      record.subject || undefined,
      record.status as NotificationStatus,
      record.sentAt,
      record.errorMessage || undefined,
      record.metadata as any
    ));
  }
}
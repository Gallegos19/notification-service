import { Notification } from '../entities/Notification';

export interface NotificationRepository {
  save(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  findByRecipient(recipient: string, limit?: number): Promise<Notification[]>;
  findAll(limit?: number, offset?: number): Promise<Notification[]>;
}
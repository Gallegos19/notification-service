import { Notification } from '../../domain/entities/Notification';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';

export interface GetNotificationHistoryRequest {
  recipient?: string;
  limit?: number;
  offset?: number;
}

export class GetNotificationHistoryUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(request: GetNotificationHistoryRequest): Promise<Notification[]> {
    if (request.recipient) {
      return await this.notificationRepository.findByRecipient(
        request.recipient,
        request.limit
      );
    }

    return await this.notificationRepository.findAll(
      request.limit,
      request.offset
    );
  }
}
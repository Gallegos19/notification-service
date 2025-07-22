import { Notification } from '../../domain/entities/Notification';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { EmailService } from '../ports/EmailService';
import { TemplateService } from '../ports/TemplateService';
import { v4 as uuidv4 } from 'uuid';

export interface SendEmailRequest {
  to: string;
  subject: string;
  templateName?: string;
  templateData?: { [key: string]: any };
  htmlContent?: string;
  textContent?: string;
  metadata?: { [key: string]: any };
}

export class SendEmailUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly emailService: EmailService,
    private readonly templateService: TemplateService
  ) {}

  async execute(request: SendEmailRequest): Promise<string> {
    const notificationId = uuidv4();
    
    try {
      // Render template if provided
      let htmlContent = request.htmlContent || '';
      if (request.templateName && request.templateData) {
        htmlContent = await this.templateService.renderEmailTemplate(
          request.templateName,
          request.templateData
        );
      }

      // Create notification entity
      const notification = Notification.createEmail(
        notificationId,
        request.to,
        request.subject,
        htmlContent,
        request.metadata
      );

      // Save as pending
      await this.notificationRepository.save(notification);

      // Send email
      await this.emailService.sendEmail({
        to: request.to,
        subject: request.subject,
        html: htmlContent,
        text: request.textContent
      });

      // Update as sent
      const sentNotification = notification.markAsSent();
      await this.notificationRepository.save(sentNotification);

      return notificationId;
    } catch (error) {
      // Mark as failed
      const notification = Notification.createEmail(
        notificationId,
        request.to,
        request.subject,
        request.htmlContent || '',
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
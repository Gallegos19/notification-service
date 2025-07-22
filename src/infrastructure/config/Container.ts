import { PrismaClient } from "@prisma/client";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { PrismaNotificationRepository } from "../database/PrismaNotificationRepository";
import { EmailService } from "../../application/ports/EmailService";
import { SendGridEmailService } from "../external/SendGridEmailService";
import { MailerSendEmailService } from "../external/MailerSendEmailService";
import { PushNotificationService } from "../../application/ports/PushNotificationService";
import { FirebasePushNotificationService } from "../external/FirebasePushNotificationService";
import { TemplateService } from "../../application/ports/TemplateService";
import { EmailTemplateService } from "../external/EmailTemplateService";
import { SendEmailUseCase } from "../../application/use-cases/SendEmailUseCase";
import { SendPushNotificationUseCase } from "../../application/use-cases/SendPushNotificationUseCase";
import { GetNotificationHistoryUseCase } from "../../application/use-cases/GetNotificationHistoryUseCase";
import { NotificationController } from "../web/controllers/NotificationController";
import { AuthMiddleware } from "../security/AuthMiddleware";
import * as path from "path";

export class Container {
  private static instance: Container;
  private dependencies: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  register<T>(key: string, factory: () => T): void {
    this.dependencies.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.dependencies.get(key);
    if (!factory) {
      throw new Error(`Dependency ${key} not found`);
    }
    return factory();
  }

  setupDependencies(): void {
    // Database
    this.register("prismaClient", () => new PrismaClient());

    // Repositories
    this.register<NotificationRepository>(
      "notificationRepository",
      () => new PrismaNotificationRepository(this.resolve("prismaClient"))
    );

    // External Services
    this.register<EmailService>("emailService", () => {
      // Solo usar mock si está explícitamente activado
      if (process.env.USE_MOCK_EMAIL === "true") {
        const { MockEmailService } = require("../external/MockEmailService");
        console.log(
          "🔧 Usando MockEmailService - Mock activado explícitamente"
        );
        return new MockEmailService();
      }

      // Usar SendGrid por defecto
      console.log(
        "📧 Usando SendGridEmailService con API key:",
        process.env.SENDGRID_API_KEY?.substring(0, 10) + "..."
      );

      return new SendGridEmailService(
        process.env.SENDGRID_API_KEY!,
        process.env.SENDGRID_FROM_EMAIL!,
        process.env.SENDGRID_FROM_NAME!
      );
    });

    this.register<PushNotificationService>(
      "pushNotificationService",
      () => new FirebasePushNotificationService()
    );

    this.register<TemplateService>(
      "templateService",
      () => new EmailTemplateService()
    );

    // Use Cases
    this.register<SendEmailUseCase>(
      "sendEmailUseCase",
      () =>
        new SendEmailUseCase(
          this.resolve("notificationRepository"),
          this.resolve("emailService"),
          this.resolve("templateService")
        )
    );

    this.register<SendPushNotificationUseCase>(
      "sendPushNotificationUseCase",
      () =>
        new SendPushNotificationUseCase(
          this.resolve("notificationRepository"),
          this.resolve("pushNotificationService")
        )
    );

    this.register<GetNotificationHistoryUseCase>(
      "getNotificationHistoryUseCase",
      () =>
        new GetNotificationHistoryUseCase(
          this.resolve("notificationRepository")
        )
    );

    // Controllers
    this.register<NotificationController>(
      "notificationController",
      () =>
        new NotificationController(
          this.resolve("sendEmailUseCase"),
          this.resolve("sendPushNotificationUseCase"),
          this.resolve("getNotificationHistoryUseCase")
        )
    );

    // Middleware
    this.register<AuthMiddleware>(
      "authMiddleware",
      () => new AuthMiddleware(process.env.JWT_SECRET!)
    );
  }
}

import { Request, Response } from "express";
import { SendEmailUseCase } from "../../../application/use-cases/SendEmailUseCase";
import { AuthenticatedRequest } from "../../security/AuthMiddleware";
import Joi from "joi";

const sendEmailSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().min(1).max(200).required(),
  templateName: Joi.string().optional(),
  templateData: Joi.object().optional(),
  htmlContent: Joi.string().optional(),
  textContent: Joi.string().optional(),
}).or("templateName", "htmlContent");

export class EmailController {
  constructor(private readonly sendEmailUseCase: SendEmailUseCase) {}

  sendEmail = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { error, value } = sendEmailSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const notificationId = await this.sendEmailUseCase.execute(value);

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
        notificationId,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to send email",
      });
    }
  };

  // Endpoint específico para recordatorios
  sendReminder = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const reminderSchema = Joi.object({
        to: Joi.string().email().required(),
        userName: Joi.string().required(),
        reminderTitle: Joi.string().required(),
        reminderMessage: Joi.string().required(),
        reminderDetails: Joi.string().optional(),
        actionUrl: Joi.string().uri().optional(),
        actionText: Joi.string().optional().default("Ver en la app"),
      });

      const { error, value } = reminderSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          error: "Validation error",
          details: error.details.map((d) => d.message),
        });
        return;
      }

      const notificationId = await this.sendEmailUseCase.execute({
        to: value.to,
        subject: value.reminderTitle,
        templateName: "reminder",
        templateData: value,
      });

      res.status(200).json({
        success: true,
        message: "Reminder sent successfully",
        notificationId,
      });
    } catch (error) {
      console.error("Error sending reminder:", error);
      res.status(500).json({
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to send reminder",
      });
    }
  };
}

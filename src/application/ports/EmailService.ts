export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailService {
  sendEmail(emailData: EmailData): Promise<void>;
}
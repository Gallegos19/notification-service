import { EmailService, EmailData } from '../../application/ports/EmailService';
import axios from 'axios';

export class MailerSendEmailService implements EmailService {
  private readonly apiUrl = 'https://api.mailersend.com/v1/email';

  constructor(
    private readonly apiKey: string,
    private readonly fromEmail: string,
    private readonly fromName: string
  ) {}

  async sendEmail(emailData: EmailData): Promise<void> {
    const payload = {
      from: {
        email: this.fromEmail,
        name: this.fromName
      },
      to: [
        {
          email: emailData.to
        }
      ],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || this.stripHtml(emailData.html)
    };

    try {
      console.log('📧 Enviando email con MailerSend...');
      console.log('   📍 Para:', emailData.to);
      console.log('   📧 Desde:', this.fromEmail);
      console.log('   📝 Asunto:', emailData.subject);

      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      console.log('✅ Email enviado exitosamente con MailerSend:', response.status);
    } catch (error: any) {
      console.error('❌ MailerSend error:', error);
      
      if (error.response) {
        console.error('📄 MailerSend response status:', error.response.status);
        console.error('📄 MailerSend response data:', error.response.data);
        
        if (error.response.status === 401) {
          console.error('🔑 Error de autenticación: Verifica tu API key de MailerSend');
          console.error('💡 Sugerencias:');
          console.error('   1. Verifica que la API key sea correcta');
          console.error('   2. Asegúrate de que tenga permisos de envío');
          console.error('   3. Verifica que no haya expirado');
        }
        
        if (error.response.status === 422) {
          console.error('📝 Error de validación: Verifica los datos del email');
          console.error('💡 Posibles problemas:');
          console.error('   1. Email remitente no verificado');
          console.error('   2. Formato de email inválido');
          console.error('   3. Contenido bloqueado');
          
          // Errores específicos de MailerSend
          if (error.response.data?.errors) {
            const errors = error.response.data.errors;
            
            if (errors.to && errors.to.some((err: string) => err.includes('Trial accounts'))) {
              console.error('🔒 CUENTA TRIAL: Solo puedes enviar emails al email de administrador');
              console.error('💡 Solución: Usa el email con el que te registraste en MailerSend como destinatario');
            }
            
            if (errors['from.email'] && errors['from.email'].some((err: string) => err.includes('domain must be verified'))) {
              console.error('🌐 DOMINIO NO VERIFICADO: El dominio del email remitente debe estar verificado');
              console.error('💡 Solución: Ve a https://app.mailersend.com/domains y verifica tu dominio');
            }
          }
        }
      }
      
      throw new Error(`Failed to send email via MailerSend: ${error.message}`);
    }
  }

  private stripHtml(html: string): string {
    // Simple HTML strip para texto plano
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}
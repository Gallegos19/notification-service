import { EmailService, EmailData } from '../../application/ports/EmailService';

export class MockEmailService implements EmailService {
  async sendEmail(emailData: EmailData): Promise<void> {
    // Simular envío de email para desarrollo
    console.log('📧 [MOCK EMAIL SERVICE] Email enviado:');
    console.log('   📍 Para:', emailData.to);
    console.log('   📝 Asunto:', emailData.subject);
    console.log('   📄 Contenido HTML:', emailData.html.substring(0, 100) + '...');
    
    if (emailData.text) {
      console.log('   📄 Contenido texto:', emailData.text.substring(0, 100) + '...');
    }
    
    // Simular un pequeño delay como si fuera real
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('   ✅ Email "enviado" exitosamente (MOCK)');
  }
}
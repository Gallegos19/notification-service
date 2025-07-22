import sgMail from "@sendgrid/mail";
import { EmailService, EmailData } from "../../application/ports/EmailService";
import * as fs from "fs";
import * as path from "path";

export class SendGridEmailService implements EmailService {
  constructor(
    private readonly apiKey: string,
    private readonly fromEmail: string,
    private readonly fromName: string
  ) {
    sgMail.setApiKey(this.apiKey);
  }

  async sendEmail(emailData: EmailData): Promise<void> {
    // Preparar attachments con los iconos de Xuma'a
    const attachments = await this.prepareAttachments();

    const msg = {
      to: emailData.to,
      from: {
        email: this.fromEmail,
        name: this.fromName,
      },
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      attachments: attachments,
    };

    try {
      console.log("📧 Enviando email con SendGrid...");
      console.log("   📍 Para:", emailData.to);
      console.log("   📧 Desde:", this.fromEmail);
      console.log("   📝 Asunto:", emailData.subject);
      console.log("   🖼️ Iconos adjuntos:", attachments.length);

      const response = await sgMail.send(msg);
      console.log("✅ Email enviado exitosamente:", response[0].statusCode);
    } catch (error: any) {
      console.error("❌ SendGrid error:", error);

      if (error.response) {
        console.error("📄 SendGrid response body:", error.response.body);

        // Verificar errores específicos
        if (error.code === 401) {
          console.error(
            "🔑 Error de autenticación: Verifica tu API key de SendGrid"
          );
          console.error("💡 Sugerencias:");
          console.error("   1. Verifica que la API key sea correcta");
          console.error('   2. Asegúrate de que tenga permisos de "Mail Send"');
          console.error("   3. Verifica que no haya expirado");
        }

        if (error.code === 403) {
          console.error("🚫 Error de permisos: Sender Identity no verificado");
          console.error("💡 Solución:");
          console.error(
            "   1. Ve a https://app.sendgrid.com/settings/sender_auth"
          );
          console.error('   2. Click en "Create a Single Sender"');
          console.error("   3. Verifica el email:", this.fromEmail);
          console.error("   4. Revisa tu bandeja y confirma la verificación");
        }

        if (error.response.body?.errors) {
          error.response.body.errors.forEach((err: any, index: number) => {
            console.error(`   Error ${index + 1}:`, err.message);
            if (err.field) console.error(`   Campo:`, err.field);
          });
        }
      }

      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  private async prepareAttachments(): Promise<any[]> {
    const attachments: any[] = [];
    const assetsPath = path.join(__dirname, "../../shared/assets");

    try {
      // Lista de iconos PNG a incluir
      const iconFiles = [
        { filename: "../../shared/assets/Xuma_a.jpg", cid: "xuma-logo" },
        { filename: "../../shared/assets/dexter-icon.png", cid: "dexter-icon" },
        { filename: "../../shared/assets/elly-icon.png", cid: "elly-icon" },
        {
          filename: "../../shared/assets/paxoloth-icon.png",
          cid: "paxoloth-icon",
        },
        { filename: "../../shared/assets/yami-icon.png", cid: "yami-icon" },
      ];
      
      for (const icon of iconFiles) {
        const iconPath = path.join(assetsPath, icon.filename);

        // Verificar si el archivo existe
        if (fs.existsSync(iconPath)) {
          const iconBuffer = fs.readFileSync(iconPath);

          attachments.push({
            content: iconBuffer.toString("base64"),
            filename: icon.filename,
            type: "image/png",
            disposition: "inline",
            content_id: icon.cid,
          });

          console.log(
            `   🖼️ Icono agregado: ${icon.filename} (cid: ${icon.cid})`
          );
        } else {
          console.warn(`   ⚠️ Icono no encontrado: ${iconPath}`);
        }
      }

      console.log(`   📎 Total de iconos adjuntos: ${attachments.length}`);
      return attachments;
    } catch (error) {
      console.error("❌ Error preparando attachments:", error);
      return []; // Devolver array vacío si hay error
    }
  }
}

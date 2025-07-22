import {
  TemplateService,
  TemplateData,
} from "../../application/ports/TemplateService";
import * as path from "path";
import * as fs from "fs/promises";

export class EmailTemplateService implements TemplateService {
  private readonly templatesPath: string;

  constructor() {
    this.templatesPath = path.join(__dirname, "../../shared/templates");
  }

  async renderEmailTemplate(
    templateName: string,
    data: TemplateData
  ): Promise<string> {
    try {
      const templatePath = path.join(
        this.templatesPath,
        `${templateName}.html`
      );
      let template = await fs.readFile(templatePath, "utf-8");

      // Simple template replacement
      Object.keys(data).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        template = template.replace(regex, data[key]);
      });

      return template;
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error);
      throw new Error(`Failed to render email template: ${templateName}`);
    }
  }
}

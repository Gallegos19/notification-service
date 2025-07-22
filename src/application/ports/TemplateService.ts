export interface TemplateData {
  [key: string]: any;
}

export interface TemplateService {
  renderEmailTemplate(templateName: string, data: TemplateData): Promise<string>;
}
const fs = require('fs');
const path = require('path');

class EmailTemplateLoader {
  constructor() {
    this.templateCache = new Map();
    this.templateDir = path.join(__dirname);
  }

  loadTemplate(templateName) {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName);
    }

    try {
      const templatePath = path.join(this.templateDir, `${templateName}.html`);
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      this.templateCache.set(templateName, templateContent);
      return templateContent;
    } catch (error) {
      throw new Error(`Failed to load email template: ${templateName}`);
    }
  }

  processTemplate(template, variables = {}) {
    let processedTemplate = template;

    Object.keys(variables).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = variables[key] || '';
      processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), value);
    });

    return processedTemplate;
  }

  getEmailTemplate(templateName, variables = {}) {
    const template = this.loadTemplate(templateName);
    return this.processTemplate(template, variables);
  }

  getOTPTemplate(otpCode) {
    return this.getEmailTemplate('otpTemplate', {
      OTP_CODE: otpCode
    });
  }

  getWelcomeTemplate(employeeData) {
    return this.getEmailTemplate('welcomeTemplate', {
      EMPLOYEE_NAME: employeeData.name,
      EMPLOYEE_EMAIL: employeeData.email,
      SETUP_URL: employeeData.setupUrl
    });
  }
}

module.exports = new EmailTemplateLoader();
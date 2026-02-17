import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, template: string, context: any) {
    return this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

  async sendVerificationEmail(to: string, login: string, password: string) {
    return this.sendEmail(to, 'Email Verification', 'verification', { login, password });
  }
}

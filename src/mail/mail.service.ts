import { AllConfigType } from '@/config/config.type';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmailVerification(email: string, token: string) {
    // Please replace the URL with your own frontend URL
    // const frontendURL = `${this.configService.get('web.url', { infer: true })}/verify/email?token=${token}`;
    const url = `${this.configService.get('app.url', { infer: true })}/api/v1/auth/verify/email?token=${token}`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Email Verification',
        template: 'email-verification',
        context: {
          email: email,
          url,
        },
      })
      .then((res) => {
        console.info(`Email sent to ${email}:`, res);
        return res;
      })
      .catch((err) => {
        console.error(`Failed to send email to ${email}:`, err);
        throw err; // Re-throw the error for further handling
      });
  }

  async sendEmailAfterVerification(email: string, userName: string) {
    const url = `${this.configService.get('web.url', { infer: true })}/`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Confirmation email',
        template: 'email-after-verification',
        context: {
          userName: userName,
          dashboardUrl: url,
        },
      })
      .then((res) => {
        console.info(`Email sent to ${email}:`, res);
        return res;
      })
      .catch((err) => {
        console.error(`Failed to send email to ${email}:`, err);
        throw err; // Re-throw the error for further handling
      });
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    const url = `${this.configService.get('web.url', { infer: true })}/reset-password?token=${token}`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Password recovery',
        template: 'email-forgot-password',
        context: {
          email,
          resetUrl: url,
        },
      })
      .then((res) => {
        console.info(`Email sent to ${email}:`, res);
        return res;
      })
      .catch((err) => {
        console.error(`Failed to send email to ${email}:`, err);
        throw err; // Re-throw the error for further handling
      });
  }
}

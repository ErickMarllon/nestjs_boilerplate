import {
  IAfterVerifyEmailJob,
  IVerifyEmailJob,
} from '@/common/interfaces/job.interface';
import { MailService } from '@/mail/mail.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);

  constructor(private readonly mailService: MailService) {}

  async sendEmailVerification(data: IVerifyEmailJob): Promise<void> {
    this.logger.debug(`Sending email verification to ${data.email}`);
    await this.mailService.sendEmailVerification(data.email, data.token);
  }
  async sendEmailAfterVerification(data: IAfterVerifyEmailJob): Promise<void> {
    this.logger.debug(`Sending email verification to ${data.email}`);
    await this.mailService.sendEmailAfterVerification(
      data.email,
      data.userName,
    );
  }
  async sendForgotPassword(data: IVerifyEmailJob): Promise<void> {
    this.logger.debug(`Sending forgot password email to ${data.email}`);
    await this.mailService.sendForgotPasswordEmail(data.email, data.token);
  }
}

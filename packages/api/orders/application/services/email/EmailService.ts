import { PaymentObjectEventDetail } from '@blc-mono/core/schemas/payments';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { EmailRepository, IEmailRepository } from '../../repositories/EmailRepository';

export interface IEmailService {
  sendPaymentSucceededEmail(event: PaymentObjectEventDetail): Promise<void>;
}
export class EmailService implements IEmailService {
  static readonly key = 'EmailService' as const;
  static readonly inject = [Logger.key, EmailRepository.key] as const;

  constructor(
    private logger: ILogger,
    private readonly emailRepository: IEmailRepository,
  ) {}

  async sendPaymentSucceededEmail(event: PaymentObjectEventDetail): Promise<void> {
    if (!event.member) {
      this.logger.error({ message: 'No member associated with payment event', context: { event } });
      throw new Error('No member associated with payment event');
    }

    if (!event.member.brazeExternalId) {
      this.logger.error({
        message: 'No Braze External Id associated with member on payment event',
        context: { event },
      });
      throw new Error('No Braze External Id associated with member on payment event');
    }

    await this.emailRepository.sendPaymentSucceededEmail({
      member: event.member,
      amount: event.amount,
    });
  }
}

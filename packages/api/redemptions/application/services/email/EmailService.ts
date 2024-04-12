import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionTransactionalEmailEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/redemptionTransactionalEmail/RedemptionTransactionalEmailController';
import { EmailRepository, IEmailRepository } from '@blc-mono/redemptions/application/repositories/EmailRepository';

export interface IEmailService {
  sendRedemptionTransactionEmail(event: RedemptionTransactionalEmailEvent): Promise<void>;
}
export class EmailService implements IEmailService {
  static key = 'BrazeEmailService' as const;
  static inject = [Logger.key, EmailRepository.key] as const;

  constructor(
    private logger: ILogger,
    private emailRepository: IEmailRepository,
  ) {}

  async sendRedemptionTransactionEmail(event: RedemptionTransactionalEmailEvent): Promise<void> {
    const redemptionType = event.detail.redemptionDetails.redemptionType;

    switch (redemptionType) {
      case 'vault': {
        await this.emailRepository.sendVaultRedemptionTransactionalEmail(event.detail);
        break;
      }
      default:
        this.logger.error({
          message: 'Unhandled redemption type',
          context: {
            eventDetail: event.detail,
          },
        });
        throw new Error('Unhandled redemption type');
    }
  }
}

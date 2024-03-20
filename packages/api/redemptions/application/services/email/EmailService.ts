import { RedemptionTransactionalEmailEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/redemptionTransactionalEmail/RedemptionTransactionalEmailController';
import { EmailRepository } from '@blc-mono/redemptions/application/repositories/EmailRepository';
import { RedemptionEventDetailType } from '@blc-mono/redemptions/infrastructure/eventBridge/events/redemptions';

export interface IEmailService {
  sendRedemptionTransactionEmail(event: RedemptionTransactionalEmailEvent): Promise<void>;
}
export class EmailService implements IEmailService {
  static key = 'BrazeEmailService' as const;
  static inject = [EmailRepository.key] as const;

  constructor(private emailRepository: EmailRepository) {}

  async sendRedemptionTransactionEmail(event: RedemptionTransactionalEmailEvent): Promise<void> {
    const eventType = event.detail.redemptionDetails.redemptionType;

    switch (eventType) {
      case RedemptionEventDetailType.REDEEMED_VAULT: {
        await this.emailRepository.sendVaultRedemptionTransactionalEmail(event.detail);
        break;
      }
    }
  }
}

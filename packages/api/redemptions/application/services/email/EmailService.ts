import { MemberRedemptionEvent } from '@blc-mono/core/schemas/redemptions';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { EmailRepository, IEmailRepository } from '@blc-mono/redemptions/application/repositories/EmailRepository';

export interface IEmailService {
  sendRedemptionTransactionEmail(event: MemberRedemptionEvent): Promise<void>;
}
export class EmailService implements IEmailService {
  static key = 'BrazeEmailService' as const;
  static inject = [Logger.key, EmailRepository.key] as const;

  constructor(
    private logger: ILogger,
    private emailRepository: IEmailRepository,
  ) {}

  async sendRedemptionTransactionEmail(event: MemberRedemptionEvent): Promise<void> {
    const redemptionType = event.detail.redemptionDetails.redemptionType;

    switch (redemptionType) {
      case 'generic':
      case 'vaultQR':
      case 'vault': {
        await this.emailRepository.sendVaultOrGenericTransactionalEmail(
          {
            affiliate: event.detail.redemptionDetails.affiliate,
            brazeExternalUserId: event.detail.memberDetails.brazeExternalUserId,
            code: event.detail.redemptionDetails.code,
            companyId: event.detail.redemptionDetails.companyId.toString(),
            companyName: event.detail.redemptionDetails.companyName,
            memberId: event.detail.memberDetails.memberId,
            offerId: event.detail.redemptionDetails.offerId.toString(),
            offerName: event.detail.redemptionDetails.offerName,
            url: event.detail.redemptionDetails.url,
          },
          redemptionType,
        );
        break;
      }
      case 'preApplied': {
        await this.emailRepository.sendPreAppliedTransactionalEmail({
          brazeExternalUserId: event.detail.memberDetails.brazeExternalUserId,
          memberId: event.detail.memberDetails.memberId,
          companyName: event.detail.redemptionDetails.companyName,
          offerName: event.detail.redemptionDetails.offerName,
          url: event.detail.redemptionDetails.url,
        });
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

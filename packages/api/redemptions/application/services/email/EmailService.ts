import {
  CREDITCARD,
  GENERIC,
  GIFTCARD,
  PREAPPLIED,
  SHOWCARD,
  VAULT,
  VAULTQR,
} from '@blc-mono/core/constants/redemptions';
import { MemberRedemptionEvent } from '@blc-mono/core/schemas/redemptions';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { EmailRepository, IEmailRepository } from '@blc-mono/redemptions/application/repositories/EmailRepository';

export interface IEmailService {
  sendRedemptionTransactionEmail(event: MemberRedemptionEvent): Promise<void>;
}
export class EmailService implements IEmailService {
  static readonly key = 'BrazeEmailService' as const;
  static readonly inject = [Logger.key, EmailRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly emailRepository: IEmailRepository,
  ) {}

  async sendRedemptionTransactionEmail(event: MemberRedemptionEvent): Promise<void> {
    const redemptionType = event.detail.redemptionDetails.redemptionType;

    switch (redemptionType) {
      case GENERIC:
      case VAULTQR:
      case VAULT: {
        await this.emailRepository.sendVaultOrGenericTransactionalEmail(
          {
            affiliate: event.detail.redemptionDetails.affiliate,
            brazeExternalUserId: event.detail.memberDetails.brazeExternalUserId,
            code: event.detail.redemptionDetails.code,
            companyId: event.detail.redemptionDetails.companyId,
            companyName: event.detail.redemptionDetails.companyName,
            memberId: event.detail.memberDetails.memberId,
            offerId: event.detail.redemptionDetails.offerId,
            offerName: event.detail.redemptionDetails.offerName,
            url: event.detail.redemptionDetails.url ?? '',
          },
          redemptionType,
        );
        break;
      }
      case GIFTCARD:
      case CREDITCARD:
      case PREAPPLIED: {
        await this.emailRepository.sendAffiliateTransactionalEmail(
          {
            brazeExternalUserId: event.detail.memberDetails.brazeExternalUserId,
            memberId: event.detail.memberDetails.memberId,
            companyName: event.detail.redemptionDetails.companyName,
            offerName: event.detail.redemptionDetails.offerName,
            url: event.detail.redemptionDetails.url,
          },
          redemptionType,
        );
        break;
      }
      case SHOWCARD:
        {
          await this.emailRepository.sendShowCardEmail({
            brazeExternalUserId: event.detail.memberDetails.brazeExternalUserId,
            companyName: event.detail.redemptionDetails.companyName,
            redemptionType: redemptionType,
          });
        }
        break;
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

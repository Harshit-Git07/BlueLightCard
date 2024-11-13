import { AffiliateConfigurationHelper } from '../../../helpers/affiliate/AffiliateConfiguration';
import { UpdateRedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

export class UpdateRedemptionConfigEntityBuilder {
  static readonly key = 'UpdateRedemptionConfigEntityBuilder' as const;

  public buildUpdateRedemptionConfigEntity(link?: string | null): UpdateRedemptionConfigEntity {
    if (!link) {
      return {
        redemptionType: 'vaultQR',
        connection: 'none',
        affiliate: null,
        url: null,
        offerType: 'in-store',
      };
    }

    const affiliateConfiguration = new AffiliateConfigurationHelper(link).getConfig();
    if (affiliateConfiguration) {
      return {
        redemptionType: 'vault',
        connection: 'affiliate',
        affiliate: affiliateConfiguration.affiliate,
        url: link,
        offerType: 'online',
      };
    }

    return {
      redemptionType: 'vault',
      connection: 'direct',
      affiliate: null,
      url: link,
      offerType: 'online',
    };
  }
}

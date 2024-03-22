import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import { OfferData } from '@/types/api/offers';
import { RedemptionType } from '@/types/api/redemptions';
import { exhaustiveCheck } from '@core/utils/exhaustiveCheck';
import { useRedeemOffer } from '../hooks';
import { GenericVaultOrPreAppliedPage } from './GenericVaultOrPreAppliedPage/GenericVaultOrPreAppliedPage';
import { Logger } from '@/services/Logger';
import { OfferRedemptionPageComponent } from './RedemptionPage';
import { ShowCardPage } from './ShowCardPage/ShowCardPage';
import { VaultQRPage } from './VaultQRPage/VaultQRPage';
import { LegacyPage } from './LegacyPage/LegacyPage';

export type Props = {
  labels: string[];
  offerMeta: OfferMeta;
  offerData: OfferData;
  redemptionType: RedemptionType | 'legacy';
};

export function RedemptionPageController(props: Props) {
  const redeemQuery = useRedeemOffer(props.offerMeta, props.offerData, props.redemptionType);
  const RedemptionPageComponent = getPageComponent(props.redemptionType);

  switch (redeemQuery.status) {
    case 'pending':
      return <RedemptionPageComponent {...props} state="loading" />;
    case 'error':
      Logger.instance.error('Error fetching redemption data', {
        error: redeemQuery.error,
      });
      return <RedemptionPageComponent {...props} state="error" />;
    case 'success':
      return <RedemptionPageComponent {...props} state="success" redeemData={redeemQuery.data} />;
    default:
      exhaustiveCheck(redeemQuery);
  }
}

function getPageComponent(redemptionType: RedemptionType | 'legacy'): OfferRedemptionPageComponent {
  switch (redemptionType) {
    case 'generic':
    case 'vault':
    case 'preApplied':
      return GenericVaultOrPreAppliedPage;
    case 'showCard':
      return ShowCardPage;
    case 'vaultQR':
      return VaultQRPage;
    case 'legacy':
      return LegacyPage;
    default:
      exhaustiveCheck(redemptionType, 'Unhandled redemption type');
  }
}

import { RedemptionType } from '../../types';
import { GenericVaultOrPreAppliedPage } from './GenericVaultOrPreAppliedPage/GenericVaultOrPreAppliedPage';
import { OfferRedemptionPageComponent } from './RedemptionPage';
import { useRedeemOffer } from '../../../../hooks/useRedeemOffer';
import { exhaustiveCheck } from '../../../../utils/exhaustiveCheck';

export type Props = {
  redemptionType: RedemptionType;
  offerId: number;
  offerName: string;
  companyName: string;
};

export function RedemptionPageController(props: Props) {
  const redeemQuery = useRedeemOffer({
    offerId: props.offerId,
    companyName: props.companyName,
    offerName: props.offerName,
  });
  const RedemptionPageComponent = getPageComponent(props.redemptionType);
  switch (redeemQuery.status) {
    case 'pending':
      return (
        <RedemptionPageComponent
          showExclusions={true}
          showOfferDescription={true}
          showShareFavorite={true}
          showTerms={true}
          redemptionType={props.redemptionType}
          state="loading"
        />
      );
    case 'error':
      return (
        <RedemptionPageComponent
          showExclusions={true}
          showOfferDescription={true}
          showShareFavorite={true}
          showTerms={true}
          redemptionType={props.redemptionType}
          state="error"
        />
      );
    case 'success':
      return (
        <RedemptionPageComponent
          showExclusions={true}
          showOfferDescription={true}
          showShareFavorite={true}
          showTerms={true}
          redemptionType={props.redemptionType}
          state="success"
          redeemData={redeemQuery.data}
        />
      );
    default:
      exhaustiveCheck(redeemQuery);
  }
}

function getPageComponent(redemptionType: RedemptionType): OfferRedemptionPageComponent {
  switch (redemptionType) {
    case 'generic':
    case 'vault':
    case 'preApplied':
      return GenericVaultOrPreAppliedPage;
    // TODO: Implement this page
    case 'showCard':
      return GenericVaultOrPreAppliedPage;
    // TODO: Implement this page
    case 'vaultQR':
      return GenericVaultOrPreAppliedPage;
    default:
      exhaustiveCheck(redemptionType, 'Unhandled redemption type');
  }
}

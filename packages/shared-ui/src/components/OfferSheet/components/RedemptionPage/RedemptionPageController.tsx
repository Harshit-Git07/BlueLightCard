import { RedemptionType } from '../../types';
import { GenericVaultOrPreAppliedPage } from './GenericVaultOrPreAppliedPage/GenericVaultOrPreAppliedPage';
import { OfferRedemptionPageComponent } from './RedemptionPage';
import { useRedeemOffer } from '../../../../hooks/useRedeemOffer';
import { exhaustiveCheck } from '../../../../utils/exhaustiveCheck';
import { RedeemResultKind } from '../../../../api';

export type Props = {
  redemptionType: RedemptionType;
  offerId: number;
  offerName: string;
  companyName: string;
  errorState?: string;
};

export function RedemptionPageController(props: Props) {
  const redeemQuery = useRedeemOffer({
    offerId: props.offerId,
    companyName: props.companyName,
    offerName: props.offerName,
  });

  const RedemptionPageComponent = getPageComponent(props.redemptionType);
  const queryData = redeemQuery.data;
  const { status } = redeemQuery;

  if (status === 'pending') {
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
  }
  if (status === 'error') {
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
  }

  if (queryData && status === 'success') {
    const data = redeemQuery.data;
    const { state } = queryData;
    switch (state) {
      case RedeemResultKind.OK:
        return (
          <RedemptionPageComponent
            showExclusions={true}
            showOfferDescription={true}
            showShareFavorite={true}
            showTerms={true}
            redemptionType={props.redemptionType}
            state="success"
            redeemData={data.data}
          />
        );
      case RedeemResultKind.MaxPerUserReached:
        return (
          <RedemptionPageComponent
            showExclusions={true}
            showOfferDescription={true}
            showShareFavorite={true}
            showTerms={true}
            redemptionType={props.redemptionType}
            state="error"
            errorState={redeemQuery.data.state}
          />
        );
      default:
        exhaustiveCheck(state, 'Unhandled redemption state');
    }
  }

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

import { RedemptionType } from '../../types';
import { RedeemResponse } from '../../../../api/redemptions';

export type Props = {
  showExclusions: boolean;
  showOfferDescription: boolean;
  showShareFavorite: boolean;
  showTerms: boolean;
  redemptionType: RedemptionType;
} & (
  | {
      state: 'loading';
    }
  | {
      state: 'error';
    }
  | {
      state: 'success';
      redeemData: RedeemResponse;
    }
);
export type OfferRedemptionPageComponent = React.FC<Props>;

export function RedemptionPage(
  component: (props: Props) => JSX.Element,
): OfferRedemptionPageComponent {
  return (props: Props) => {
    return component(props);
  };
}

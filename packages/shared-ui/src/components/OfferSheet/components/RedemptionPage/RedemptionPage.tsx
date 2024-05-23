import { RedemptionType } from '../../types';
import { RedeemData } from '../../../../api';

export type Props = {
  showExclusions: boolean;
  showOfferDescription: boolean;
  showShareFavorite: boolean;
  showTerms: boolean;
  errorState?: string;
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
      redeemData: RedeemData;
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

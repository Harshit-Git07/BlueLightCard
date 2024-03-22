import { OfferMeta } from '@/context/OfferSheet/OfferSheetContext';
import { OfferData } from '@/types/api/offers';
import React, { useEffect } from 'react';
import { UseRedeemData } from '../hooks';

export type LegacyRedeemData = {
  redemptionType: 'legacy';
};
export type Props = {
  __storybook?: boolean;
  labels: string[];
  offerMeta: OfferMeta;
  offerData: OfferData;
} & (
  | {
      state: 'loading';
    }
  | {
      state: 'error';
    }
  | {
      state: 'success';
      redeemData: UseRedeemData;
    }
);
export type UseOnRedeemCallback = (redeemData: UseRedeemData) => (() => void) | void;
export type UseOnRedeem = (callback: UseOnRedeemCallback) => void;
export type Hooks = {
  /**
   * Executes the callback once when the redemption state changes to 'success'
   */
  useOnRedeemed: UseOnRedeem;
};
export type OfferRedemptionPageComponent = React.FC<Props>;

export function RedemptionPage(
  component: (props: Props, hooks: Hooks) => JSX.Element
): OfferRedemptionPageComponent {
  return (props: Props) => {
    const useOnRedeemed: UseOnRedeem = (callback: UseOnRedeemCallback) => {
      useEffect(() => {
        if (props.state === 'success' && !props.__storybook) {
          return callback(props.redeemData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [props.state]);
    };

    return component(props, { useOnRedeemed });
  };
}

import { useRedeemOfferMutation } from '../mutations/redeem-offer-mutation';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { offerDetailsQuery } from '../queries/offer-details-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import OfferSheetHeader from '../offer-sheet-header';
import type { Amplitude } from '../../../adapters';
import MagicButton, { MagicBtnVariant } from '../../MagicButton';
import { DrawerFooter } from '../../Drawer';
import Label from '../../Label';
import { getButtonState } from '../utils/getButtonState';

type VaultCodeJourneyProps = {
  offerId: number;
  companyName: string;
  amplitude: Amplitude | null | undefined;
};

const buttonTypeMap = {
  initial: {
    label: 'Get Discount',
    variant: MagicBtnVariant.Primary,
  },
  pressed: {
    label: 'Code Copied',
    description: 'You will be redirected to the partner website shortly.',
    icon: faWandMagicSparkles,
    variant: MagicBtnVariant.Pressed,
  },
  error: {
    label: 'Something went wrong',
    description: 'Please try again',
    variant: MagicBtnVariant.Disabled,
  },
};

export default function VaultRedemptionJourney(props: Readonly<VaultCodeJourneyProps>) {
  const offer = useSuspenseQuery(offerDetailsQuery(props.offerId));
  const redeem = useRedeemOfferMutation();

  return (
    <>
      <div className="overflow-y-auto pt-6">
        <OfferSheetHeader
          offerData={offer.data}
          companyName={props.companyName}
          amplitude={props.amplitude}
        />
      </div>

      <DrawerFooter>
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {offer.data.labels.map((label) => (
            <Label key={label} type={'normal'} text={label} className="m-1" />
          ))}
        </div>
        <MagicButton
          className="w-full"
          onClick={() =>
            redeem.mutate({
              offerId: props.offerId,
              companyName: props.companyName,
              offerName: offer.data.name,
              companyId: offer.data.companyId,
              amplitude: props.amplitude,
            })
          }
          {...buttonTypeMap[getButtonState(redeem.status)]}
          data-testid={'_sheet_redeem_button'}
        />
      </DrawerFooter>
    </>
  );
}

import { offerDetailsQuery } from '../queries/offer-details-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import OfferSheetHeader from '../offer-sheet-header';
import { DrawerFooter } from '../../Drawer';
import type { Amplitude } from '../../../adapters';
import MagicButton, { MagicBtnVariant, MagicButtonProps } from '../../MagicButton';
import Label from '../../Label';
import QRCode from 'react-qr-code';
import { mergeClassnames } from '../../../utils/cssUtils';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import useRedeemQRMutation from '../mutations/redeem-qr-code';

type VaultCodeJourneyProps = {
  offerId: number;
  companyName: string;
  amplitude: Amplitude | null | undefined;
};

type QRCodeDisplayProps = {
  status: 'pending' | 'error' | 'success' | 'idle';
  code?: string;
};

function QRCodeDisplay({ status, code }: Readonly<QRCodeDisplayProps>) {
  return (
    <div
      className={mergeClassnames(
        'transition-all flex items-center justify-center flex-col flex-1',
        {
          'blur-lg': status !== 'success',
        },

        {
          'animate-pulse': status === 'pending',
        },
      )}
    >
      <QRCode value={code ?? 'loading'} size={200} />

      <h1 className="text-colour-onSurface-light dark:text-colour-onSurface-dark font-typography-body-semibold font-typography-body-semibold-weight text-typography-body-semibold tracking-typography-body-semibold leading-typography-body-semibold pt-4 pb-2">
        {code ?? 'loading'}
      </h1>
    </div>
  );
}

export default function VaultQRRedemptionJourney(props: Readonly<VaultCodeJourneyProps>) {
  const offer = useSuspenseQuery(offerDetailsQuery(props.offerId));
  const redeem = useRedeemQRMutation();

  const generateCode = () => {
    redeem.mutate({
      offerId: props.offerId,
      companyName: props.companyName,
      offerName: offer.data.name,
      companyId: offer.data.companyId,
      amplitude: props.amplitude,
    });
  };

  const buttonTypeMap = {
    initial: {
      label: 'Show QR code',
      onClick: generateCode,
      variant: MagicBtnVariant.Primary,
    },
    pressed: {
      label: 'QR Code ready',
      description: 'Show the above code to get discount',
      icon: faWandMagicSparkles,
      variant: MagicBtnVariant.Pressed,
    },
  };

  const magicButtonLabels: MagicButtonProps = redeem.isSuccess
    ? buttonTypeMap.pressed
    : buttonTypeMap.initial;

  return (
    <>
      <div className="overflow-y-auto pt-6">
        <OfferSheetHeader
          offerData={offer.data}
          companyName={props.companyName}
          amplitude={props.amplitude}
        />
      </div>

      <QRCodeDisplay status={redeem.status} code={redeem.data} />

      <DrawerFooter>
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {offer.data.labels.map((label) => (
            <Label key={label} type={'normal'} text={label} className="m-1" />
          ))}
        </div>
        <MagicButton
          className="w-full"
          {...magicButtonLabels}
          data-testid={'_sheet_redeem_button'}
        />
      </DrawerFooter>
    </>
  );
}

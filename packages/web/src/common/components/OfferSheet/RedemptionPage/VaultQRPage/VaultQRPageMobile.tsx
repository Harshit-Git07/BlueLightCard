import React from 'react';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '@/components/Image/Image';
import Label from '@/components/Label/Label';
import MagicButton from '@/components/MagicButton/MagicButton';
import { Props as RedemptionPageProps } from '../RedemptionPage';
import OfferTopDetailsHeader from '../../OfferTopDetailsHeader/OfferTopDetailsHeader';

export const VaultQRPageMobile = (props: RedemptionPageProps) => {
  return (
    <div className="flex flex-col h-[100vh] items-center mx-auto">
      {/* Header section - Offer logo, title, description, etc. */}
      <OfferTopDetailsHeader
        offerMeta={props.offerMeta}
        offerData={props.offerData}
        companyId={props.offerMeta.companyId}
        showShareFavorite={false}
        showTerms={false}
      />

      {/* Top section - Product info, share/fav etc. */}
      <div className="flex flex-col text-center items-center justify-center text-wrap space-y-2 mt-6 mx-auto">
        <div>
          {/* TODO: QR code coming from the redemption API - change later */}
          <Image
            src="/assets/offer_qrcode_deleteLater.png"
            alt="offerQrCode"
            fill={false}
            width={175}
            height={175}
          />
        </div>
      </div>

      {/* Bottom section - Button labels etc */}
      <div className="w-full pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {props.labels.map((label, index) => (
            <Label key={index} type="normal" text={label} className="m-1" />
          ))}
        </div>

        <MagicButton variant={'secondary'} className="w-full" onClick={() => void 0} animate={true}>
          <div className="flex-col min-h-7 text-nowrap items-center">
            <div className="text-md font-bold flex gap-2 items-center">
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              <div>Show this QR code</div>
            </div>
            <div className="text-sm text-[#616266] font-normal">to get your discount</div>
          </div>
        </MagicButton>
      </div>
    </div>
  );
};

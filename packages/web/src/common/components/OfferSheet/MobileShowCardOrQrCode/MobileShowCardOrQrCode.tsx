import React, { useState, useContext } from 'react';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MagicButton from '../../MagicButton/MagicButton';
import Label from '../../Label/Label';
import Image from '@/components/Image/Image';
import OfferSheetContext from '@/context/OfferSheet/OfferSheetContext';
import OfferTopDetailsHeader from '../OfferTopDetailsHeader/OfferTopDetailsHeader';
import { offerResponse } from '@/context/OfferSheet/OfferSheetContext';

export type MobileShowCardOrQrCodeProps = {
  redemptionType: string;
  companyId: string;
  offerData: offerResponse;
};

// Mobile component to show redemptionType equal to showCard or vaultQR

const MobileShowCardOrQrCode: React.FC<MobileShowCardOrQrCodeProps> = ({
  redemptionType,
  offerData,
  companyId,
}) => {
  const { offerLabels } = useContext(OfferSheetContext);

  return (
    <div className="flex flex-col h-[100vh] items-center mx-auto">
      {/* Header section - Offer logo, title, description, etc. */}
      {redemptionType === 'vaultQR' && (
        <OfferTopDetailsHeader
          {...{ offerData, companyId, showShareFavorite: false, showTerms: false }}
        />
      )}
      {/* Top section - Product info, share/fav etc. */}
      <div className="flex flex-col text-center items-center justify-center text-wrap space-y-2 mt-6 mx-auto">
        {redemptionType === 'showCard' && (
          <Image
            src="/assets/blc-card.png"
            alt="blcCard"
            fill={false}
            width={250}
            height={400}
            className="shadow-md rounded-[30px]"
          ></Image>
        )}
        {redemptionType === 'vaultQR' && (
          <div>
            <Image
              src="/assets/offer_qrcode_deleteLater.png"
              alt="offerQrCode"
              fill={false}
              width={175}
              height={175}
            ></Image>
          </div>
        )}
        {/* QR code coming from the redemption API - change later */}
      </div>
      {/* Bottom section - Button labels etc */}
      <div className="w-full pt-3 pb-4 px-4 shadow-offerSheetTop fixed bottom-0 bg-white">
        <div className="w-full flex flex-wrap mb-2 justify-center">
          {offerLabels &&
            offerLabels.map((label, index) => (
              <Label key={index} type={'normal'} text={label} className="m-1" />
            ))}
        </div>

        <MagicButton
          variant={'secondary'}
          className="w-full"
          onClick={() => void 0}
          animate={true}
          transitionDurationMs={1000}
        >
          <div className="flex-col min-h-7 text-nowrap items-center">
            <div className="text-md font-bold flex gap-2 items-center">
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              {redemptionType === 'showCard' && <div>Simply show your Blue Light Card</div>}
              {redemptionType === 'vaultQR' && <div>Show this QR code</div>}
            </div>
            <div className="text-sm text-[#616266] font-normal">to get your discount</div>
          </div>
        </MagicButton>
      </div>
    </div>
  );
};

export default MobileShowCardOrQrCode;

import React from 'react';
import Image from '@/components/Image/Image';
import SocialLinks from '../../SocialLinks/SocialLinks';
import OfferTopDetailsHeader from '../OfferTopDetailsHeader/OfferTopDetailsHeader';
import { offerResponse } from '@/context/OfferSheet/OfferSheetContext';

export type DesktopShowCardOrQrCodeProps = {
  redemptionType: string;
  companyName: string;
  companyId: string;
  offerData: offerResponse;
};

// Desktop component to show redemptionType equal to showCard or vaultQR

const DesktopShowCardOrQrCode: React.FC<DesktopShowCardOrQrCodeProps> = ({
  redemptionType,
  companyName,
  offerData,
  companyId,
}) => {
  return (
    <div className="flex flex-col text-center h-screen">
      {/* Header section - Offer logo, title, description, etc. */}
      <OfferTopDetailsHeader
        {...{
          offerData,
          companyId,
          showOfferDescription: false,
          showShareFavorite: false,
          showTerms: false,
        }}
      />

      {/* Middle section - Instructions. */}
      {redemptionType === 'showCard' && (
        <div className="flex flex-col items-center font-['MuseoSans'] mx-7 justify-center tablet:flex-1">
          <Image
            src="/assets/showBlcCard.svg"
            alt="blcCard"
            fill={false}
            width={100}
            height={100}
          ></Image>
          <p className="text-xl font-semibold">Show your Blue Light Card</p>
          <p className="text-base font-light text-[#616266]">
            Show your virtual or physical card in store.
          </p>
        </div>
      )}

      {redemptionType === 'vaultQR' && (
        <div className="flex flex-col items-center font-['MuseoSans'] mx-5 tablet:flex-1 justify-center">
          <div className="space-y-1 mb-3 flex flex-col items-center">
            <Image
              src="/assets/getQrCode.svg"
              alt="getQrCode"
              fill={false}
              width={100}
              height={100}
            ></Image>
            <p className="text-xl font-semibold">1. Get QR code</p>
            <p className="text-base font-light text-[#616266]">
              Dowloand our app or go to your emails to access QR code.
            </p>
          </div>
          <div className="space-y-1 flex flex-col items-center">
            <Image
              src="/assets/showQrCode.svg"
              alt="showQrCode"
              fill={false}
              width={100}
              height={100}
            ></Image>
            <p className="text-xl font-semibold">2. Show QR code and enjoy your discount</p>
            <p className="text-base font-light text-[#616266]">
              Present the code on your visit to a <span className="font-bold">{companyName}</span>{' '}
              location to redeem your discount.
            </p>
          </div>
        </div>
      )}

      {/* Bottom section - Links to google play and apple store. */}
      <div className="mt-4">
        <SocialLinks />
      </div>
    </div>
  );
};

export default DesktopShowCardOrQrCode;

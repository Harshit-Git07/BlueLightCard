import React from 'react';
import Image from '@/components/Image/Image';
import SocialLinks from '@/components/SocialLinks/SocialLinks';
import OfferTopDetailsHeader from '../../OfferTopDetailsHeader/OfferTopDetailsHeader';
import { Props as RedemptionPageProps } from '../RedemptionPage';

export const ShowCardPageDesktop = (props: RedemptionPageProps) => {
  return (
    <div className="flex flex-col text-center h-screen">
      {/* Header section - Offer logo, title, description, etc. */}
      <OfferTopDetailsHeader
        offerMeta={props.offerMeta}
        offerData={props.offerData}
        companyId={props.offerMeta.companyId}
        showOfferDescription={false}
        showShareFavorite={false}
        showTerms={false}
      />

      {/* Middle section - Instructions. */}
      <div className="flex flex-col items-center font-['MuseoSans'] mx-7 justify-center tablet:flex-1">
        <Image src="/assets/showBlcCard.svg" alt="blcCard" fill={false} width={100} height={100} />
        <p className="text-xl font-semibold">Show your Blue Light Card</p>
        <p className="text-base font-light text-[#616266]">
          Show your virtual or physical card in store.
        </p>
      </div>

      {/* Bottom section - Links to google play and apple store. */}
      <div className="mt-4">
        <SocialLinks />
      </div>
    </div>
  );
};

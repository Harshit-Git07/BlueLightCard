import { Heading, ResponsiveOfferCard } from '@bluelightcard/shared-ui/index';
import React, { FC } from 'react';
import { useMedia } from 'react-use';
import { OfferData } from './types';

type props = {
  offers: OfferData[];
  companyName: string;
  companyId: string;
  onOfferClick: (
    offerId: number,
    offerName: string,
    companyId: number,
    companyName: string,
    offerIndex: number
  ) => void;
};

const CompanyPageOffers: FC<props> = ({ offers, companyName, companyId, onOfferClick }) => {
  const isMobile = useMedia('(max-width: 500px)');
  return (
    <>
      {offers && offers.length > 0 && (
        <div className="mb-0 desktop:mb-[71px]">
          <div
            className={`flex flex-col ${
              isMobile ? 'gap-2' : 'gap-10'
            } tablet:gap-10 desktop:grid desktop:grid-cols-2`}
          >
            {offers?.map((offer: OfferData, index: number) => (
              <button
                className="text-left"
                key={offer.id}
                onClick={() =>
                  onOfferClick(
                    offer.id,
                    offer.name,
                    Number(offer.companyId),
                    offer.companyName,
                    index + 1
                  )
                }
              >
                <ResponsiveOfferCard
                  id={offer.id}
                  type={offer.type}
                  name={offer.name}
                  image={offer.image}
                  companyId={Number(companyId)}
                  companyName={companyName}
                  variant={isMobile ? 'horizontal' : 'vertical'}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {(!offers || offers.length <= 0) && (
        <div className="mb-0 desktop:mb-[71px]">
          <Heading headingLevel="h1">No offers have been found.</Heading>
        </div>
      )}
    </>
  );
};

export default CompanyPageOffers;

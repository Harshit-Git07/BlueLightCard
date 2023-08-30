import Heading from '@/components/Heading/Heading';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import getMobileSearchStaticProps from '../../common/utils/getProps/getMobileSearchProps';
import HorizontalCard from '@/components/HorizontalCard/HorizontalCard';

export const getStaticProps = getMobileSearchStaticProps;

type MobileOffersPageProps = {
  offers: any[];
};

const MobileOffersPage: NextPage<MobileOffersPageProps> = (props) => {
  const { offers } = props;
  return (
    <>
      <div className="flex flex-col p-4">
        {/* Container for all cards */}
        <Heading headingLevel={'h3'}>Popular Offers</Heading>
        {offers?.map((offer, index) => {
          return (
            <div key={index} className="border-t-1 last:border-b-1 py-2">
              {/* This is a wrapper container for each card */}
              <HorizontalCard
                img={offer.companyLogo}
                title={offer.companyName}
                link={offer.linkUrl}
                description={offer.offerDescription}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MobileOffersPage;

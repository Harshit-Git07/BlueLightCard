import Heading from '@/components/Heading/Heading';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import getMobileSearchStaticProps from '../../common/utils/getStaticProps/getMobileSearchProps';

export const getStaticProps = getMobileSearchStaticProps;

type MobileOffersPageProps = {
  offers: any[];
};

const MobileOffersPage: NextPage<MobileOffersPageProps> = (props) => {
  const { offers } = props;
  return (
    <>
      <div className="flex flex-col p-4 space-y-2">
        {/* Container for all cards */}
        <Heading headingLevel={'h3'}>Popular Offers</Heading>
        {offers?.map((offer, index) => {
          // ListCard
          return (
            <div key={index} className="">
              {/* This is a wrapper container for each card */}
              <Link href="/">
                {/* Link for each card to have, will likely use data from offer */}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MobileOffersPage;

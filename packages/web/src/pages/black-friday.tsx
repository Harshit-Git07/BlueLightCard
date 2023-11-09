import React from 'react';
import { NextPage } from 'next';

import withAuth from '@/hoc/withAuth';
import BlackFridayOfferSection from '@/offers/components/landing/black-friday/BlackFridayOfferSection/BlackFridayOfferSection';
import { ThemeVariant } from '@/types/theme';
import blackFridayLandingPageConfig from '@/data/landing/blackFridayPageConfig';
import { BlackFridayOfferSectionProps } from '@/offers/components/landing/black-friday/BlackFridayOfferSection/types';
import { BlackFridayLandingPageConfigProps } from '@/page-types/landing/black-friday';

const BlackFridayLandingPage: NextPage<BlackFridayLandingPageConfigProps> = ({ offerSections }) => {
  return (
    <>
      {offerSections.map(
        ({ title, subtitle, offers }: BlackFridayOfferSectionProps, index: number) => (
          <BlackFridayOfferSection
            key={index}
            title={title}
            subtitle={subtitle}
            offers={offers}
            variant={index % 2 ? ThemeVariant.Secondary : ThemeVariant.Primary}
          />
        )
      )}
    </>
  );
};

export const getStaticProps = () => {
  const { offerSections } = blackFridayLandingPageConfig;
  return {
    props: {
      offerSections,
    },
  };
};

export default withAuth(BlackFridayLandingPage);

import React from 'react';
import { NextPage } from 'next';

import withAuth from '@/hoc/withAuth';

import BlackFridayBannerSection from '@/offers/components/landing/black-friday/BlackFridayBannerSection';
import BlackFridayHeroSection from '@/offers/components/landing/black-friday/BlackFridayHeroSection';
import BlackFridayOfferSection from '@/offers/components/landing/black-friday/BlackFridayOfferSection';
import { ThemeVariant } from '@/types/theme';

import blackFridayLandingPageConfig from '@/data/landing/blackFridayPageConfig';
import { BlackFridayLandingPageConfigProps } from '@/page-types/landing/black-friday';
import { BlackFridayOfferSectionProps } from '@/offers/components/landing/black-friday/types';
import BlackFridayHeaderSection from '@/offers/components/landing/black-friday/BlackFridayHeaderSection';

const BlackFridayLandingPage: NextPage<BlackFridayLandingPageConfigProps> = ({
  bannerSection,
  heroSection,
  offerSections,
}) => (
  <>
    <div className="w-full h-screen">
      <BlackFridayHeaderSection />
      <BlackFridayBannerSection {...bannerSection} />
    </div>

    <BlackFridayHeroSection {...heroSection} />
    {offerSections.map(
      ({ id, title, subtitle, offers }: BlackFridayOfferSectionProps, index: number) => (
        <BlackFridayOfferSection
          key={index}
          id={id}
          title={title}
          subtitle={subtitle}
          offers={offers}
          variant={index % 2 ? ThemeVariant.Secondary : ThemeVariant.Primary}
        />
      )
    )}
  </>
);

export const getStaticProps = () => {
  const { bannerSection, heroSection, offerSections } = blackFridayLandingPageConfig;
  return {
    props: {
      bannerSection,
      heroSection,
      offerSections,
    },
  };
};

export default withAuth(BlackFridayLandingPage);

import React from 'react';
import { NextPage } from 'next';

import BlackFridayBannerSection from '@/offers/components/landing/black-friday/BlackFridayBannerSection';
import BlackFridayHeroSection from '@/offers/components/landing/black-friday/BlackFridayHeroSection';
import BlackFridayOfferSection from '@/offers/components/landing/black-friday/BlackFridayOfferSection';
import { ThemeVariant } from '@/types/theme';

import blackFridayLandingPageConfig from '@/data/landing/blackFridayPageConfig';
import { BlackFridayLandingPageConfigProps } from '@/page-types/landing/black-friday';
import { BlackFridayOfferSectionProps } from '@/offers/components/landing/black-friday/types';
import BlackFridayHeaderSection from '@/offers/components/landing/black-friday/BlackFridayHeaderSection';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import MetaData from '@/components/MetaData/MetaData';

const BlackFridayLandingPage: NextPage<BlackFridayLandingPageConfigProps> = ({
  bannerSection,
  heroSection,
  offerSections,
  translationNamespace,
}) => (
  <>
    <MetaData seo={layoutProps} translationNamespace={translationNamespace}></MetaData>

    <div className="w-full h-screen">
      <BlackFridayHeaderSection />
      <BlackFridayBannerSection {...bannerSection} />
    </div>

    <BlackFridayHeroSection {...heroSection} />
    {offerSections.map(
      (
        { id, title, subtitle, offers, shopAllCtaLink }: BlackFridayOfferSectionProps,
        index: number
      ) => (
        <BlackFridayOfferSection
          key={index}
          id={id}
          title={title}
          subtitle={subtitle}
          offers={offers}
          shopAllCtaLink={shopAllCtaLink}
          variant={index % 2 ? ThemeVariant.Secondary : ThemeVariant.Primary}
        />
      )
    )}
  </>
);

export const getStaticProps = (props: any) => {
  const translationProps = getI18nStaticProps(props);

  const { bannerSection, heroSection, offerSections } = blackFridayLandingPageConfig;
  return {
    ...translationProps,
    props: {
      bannerSection,
      heroSection,
      offerSections,
    },
  };
};

const layoutProps = {
  title: 'Black Friday 2023 | Blue Light Card',
  description:
    'Our Black Friday savings are live! Shop and save between 24th and 27th November. Don’t miss out!',
  keywords: 'Black Friday, Blue Light Card',
  ogTitle: 'Black Friday 2023',
  ogType: 'Black Friday savings for the Blue Light community',
  ogDescription: 'Black Friday savings for the Blue Light community',
  ogUrl: 'bluelightcard.co.uk/black-friday',
  ogImage:
    'https://cdn.bluelightcard.co.uk/web/landing-pages/black-friday-2023/black_friday_logo.png',
  sitename: 'Blue Light Card',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Black Friday 2023',
  twitterDescription: 'Black Friday savings for the Blue Light community',
  twitterImage:
    'https://cdn.bluelightcard.co.uk/web/landing-pages/black-friday-2023/black_friday_logo.png',
  twitterImageAlt: 'Black Friday 2023',
  twitterUrl: 'https://www.bluelightcard.co.uk/black-friday',
  twitterSite: '@bluelightcard',
  twitterCreator: '@bluelightcard',
};

export default BlackFridayLandingPage;

import React from 'react';
import Image from 'next/image';
import { BlackFridayOfferProps, BlackFridayOfferSectionProps } from './types';
import { ThemeVariant } from '@/types/theme';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import Heading from '@/components/Heading/Heading';

const lightDesign = {
  backgroundColor: 'bg-[#FFFFFF]',
  headingTextColor: '!text-[#000033]',
  subtitleTextColor: 'text-[#000033]',
  offerImageBorderColor: 'border-[#1C1C1C]',
  offerTitleTextColor: 'text-[#1C1C1C]',
  offerCtaBackgroundColor: '!bg-[#1C1C1C]',
  offerCtaTextColor: '!text-[#FFFF00]',
  hoverOfferCtaBackgroundColor: 'hover:bg-[#1C1C1C]',
};

const darkDesign = {
  backgroundColor: 'bg-[#1C1C1C]',
  headingTextColor: '!text-[#FFFFFF]',
  subtitleTextColor: 'text-[#FFFFFF]',
  offerImageBorderColor: 'border-[#FFFFFF]',
  offerTitleTextColor: 'text-[#FFFFFF]',
  offerCtaBackgroundColor: '!bg-[#FFFF00]',
  offerCtaTextColor: '!text-[#1C1C1C]',
  hoverOfferCtaBackgroundColor: 'hover:bg-[#FFFF00]',
};

const themeVariants = {
  [ThemeVariant.Primary]: lightDesign,
  [ThemeVariant.Secondary]: darkDesign,
};

const BlackFridayOfferSection = ({
  title,
  subtitle,
  offers,
  variant = ThemeVariant.Primary,
}: BlackFridayOfferSectionProps) => {
  const chosenVariant = themeVariants[variant];

  return (
    <section className={`${chosenVariant['backgroundColor']} py-20 dark:bg-dark lg:py-[120px]`}>
      <Container>
        <Heading
          className={`font-bold ${chosenVariant['headingTextColor']} text-center mb-5`}
          headingLevel={'h1'}
        >
          {title}
        </Heading>
        <p className={`${chosenVariant['subtitleTextColor']} text-center mb-12`}>{subtitle}</p>
        <div className="mobile:mx-auto -mx-4 mb-10 flex flex-wrap">
          {offers.map(({ imgSrc, title, link }: BlackFridayOfferProps, index: number) => (
            <BlackFridayOffer
              key={index}
              imgSrc={imgSrc}
              title={title}
              link={link}
              variant={variant === ThemeVariant.Secondary ? ThemeVariant.Secondary : undefined}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            type="link"
            href={'/#'}
            className={`px-20 py-4 font-semibold font-[MuseoSans] ${chosenVariant['offerCtaTextColor']} ${chosenVariant['offerCtaBackgroundColor']} focus:outline-0 ${chosenVariant['hoverOfferCtaBackgroundColor']}`}
          >
            Shop all
          </Button>
        </div>
      </Container>
    </section>
  );
};

const BlackFridayOffer = ({
  imgSrc,
  title,
  link,
  variant = ThemeVariant.Primary,
}: BlackFridayOfferProps) => {
  const chosenVariant = themeVariants[variant];

  return (
    <div className="w-full px-4 mobile:w-1/2 tablet:w-1/3 laptop:w-1/4">
      <div className="p-[10px]">
        <a href={link} className="block">
          <Image
            src={imgSrc}
            alt="Black friday offer"
            fill={false}
            width={286}
            height={174}
            className={`h-auto w-full rounded-md border-[1px] ${chosenVariant['offerImageBorderColor']}`}
            quality={100}
          />
        </a>
        <div className="pb-4 pt-5 text-center">
          <div>
            <h3>
              <a
                href={link}
                className={`mb-4 block text-l font-semibold font-[MuseoSans] mobile:text-lg tablet:text-xl truncate ${chosenVariant['offerTitleTextColor']}`}
              >
                {title}
              </a>
            </h3>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button
              type="link"
              href={link}
              className={`font-semibold font-[MuseoSans] mobile:text-sm mobile:py-2 mobile:px-4 tablet:px-6 tablet:text-base desktop:text-base ${chosenVariant['offerCtaTextColor']} ${chosenVariant['offerCtaBackgroundColor']} focus:outline-0 ${chosenVariant['hoverOfferCtaBackgroundColor']}`}
            >
              Get Offer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackFridayOfferSection;

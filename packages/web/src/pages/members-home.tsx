import { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import headerConfig from '../../data/header.json';
import homePageData from '../../data/homePageData.json';
import footerConfig from '../../data/footer.json';
import Header from '@/components/Header/Header';
import Image from '@/components/Image/Image';
import Heading from '@/components/Heading/Heading';
import Carousel from '@/components/Carousel/Carousel';
import Footer from '@/components/Footer/Footer';
import OfferCard from '../offers/components/OfferCard';
import useIsVisible from '@/hooks/useIsVisible';

type BannerProps = {
  linkId: string;
  image: string;
  bannerType: string;
  legacyCompanyId: number;
  companyId: string;
  ageRestricted: boolean;
};

const Banner = ({
  linkId,
  image,
  bannerType,
  legacyCompanyId,
  companyId,
  ageRestricted,
}: BannerProps) => {
  return (
    <div className="w-full relative">
      <Image
        src={image}
        alt="Banner image"
        fill={false}
        width="0"
        height="0"
        sizes="100vw"
        className={'h-auto w-full'}
        quality={50}
      />
    </div>
  );
};

const Container = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className={`${className} px-2 tablet:px-8 laptop:px-64 py-4 w-full`}>{children}</div>
      <hr />
    </>
  );
};

const PseudoCarousel = ({
  title,
  itemsToShow,
  offers,
  flexibleMenu,
}: {
  title: string;
  itemsToShow: number;
  flexibleMenu?: boolean;
  offers: {
    offerName: string;
    companyName: string;
    image: string;
    legacyCompanyId: number;
    legacyOfferId: number;
  }[];
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(carouselRef);

  /** Set temporary placeholder height to only load carousel if space on screen */
  const [className, setClassName] = useState('h-[400px]');

  /** If element is visible on screen, remove placeholder height */
  useEffect(() => {
    if (isVisible) setClassName('');
  }, [isVisible]);

  return (
    <div className={className} ref={carouselRef}>
      {isVisible && (
        <>
          <Heading headingLevel="h2">{title}</Heading>
          <Carousel
            showControls
            autoPlay
            elementsPerPageDesktop={itemsToShow}
            elementsPerPageLaptop={itemsToShow}
            elementsPerPageMobile={1}
            elementsPerPageTablet={2}
          >
            {offers.map((offer, index) => {
              return (
                <OfferCard
                  key={index}
                  alt={'Card'}
                  offerName={offer.offerName}
                  companyName={offer.companyName}
                  imageSrc={offer.image}
                  offerLink={`https://www.bluelightcard.co.uk/offerdetails.php?cid=${offer.legacyCompanyId}&${offer.legacyOfferId}`}
                  variant={flexibleMenu ? 'small' : ''}
                />
              );
            })}
          </Carousel>
        </>
      )}
    </div>
  );
};

const HomePage: NextPage<any> = (props) => {
  // Unpack data
  // TODO: Wrap in layout

  const { header, banners, dealsOfTheWeek, flexible, marketplace, featured, footer } = props;
  return (
    <>
      <Header logoUrl={header.logoSource} navItems={header.navItems} loggedIn={true} />
      <Container>
        <Carousel
          autoPlay
          showControls
          elementsPerPageLaptop={1}
          elementsPerPageDesktop={1}
          elementsPerPageTablet={1}
          elementsPerPageMobile={1}
        >
          {banners.map((banner: any, index: number) => {
            return <Banner key={index} {...banner} />;
          })}
        </Carousel>
      </Container>

      <Container className="flex flex-col">
        <PseudoCarousel title="Deals of the week" itemsToShow={2} offers={dealsOfTheWeek} />
      </Container>

      <Container className="flex flex-col">
        <PseudoCarousel
          title="Ways to save"
          itemsToShow={3}
          flexibleMenu={true}
          offers={flexible.map((offer: any) => {
            return {
              offerName: offer.intro,
              image: offer.imagedetail,
              companyName: '',
            };
          })}
        />
      </Container>

      {marketplace.map((menu: any, index: number) => {
        return (
          <Container key={index}>
            <PseudoCarousel title={menu.name} itemsToShow={3} offers={menu.items} />
          </Container>
        );
      })}

      <Container className="flex flex-col">
        <PseudoCarousel title="Featured Offers" itemsToShow={3} offers={featured} />
      </Container>

      <Footer {...footer} />
    </>
  );
};

export async function getStaticProps(context: any) {
  // Pull in the dummy data
  // Format data
  // Pass data through
  return {
    props: {
      header: headerConfig,
      banners: homePageData[0].banners,
      dealsOfTheWeek: homePageData[0].deals,
      flexible: homePageData[0].flexible,
      marketplace: homePageData[0].marketplace,
      featured: homePageData[0].featured,
      footer: footerConfig.footer,
    },
  };
}

export default HomePage;

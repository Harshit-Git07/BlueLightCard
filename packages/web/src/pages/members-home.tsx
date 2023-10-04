import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import headerConfig from '@/data/header.json';
import footerConfig from '@/data/footer.json';
import Header from '@/components/Header/Header';
import Heading from '@/components/Heading/Heading';
import Carousel from '@/components/Carousel/Carousel';
import Footer from '@/components/Footer/Footer';
import withAuth from '@/hoc/withAuth';
import { homePageQuery } from 'src/graphql/homePageQueries';
import makeQuery from 'src/graphql/makeQuery';
import Link from '@/components/Link/Link';
import Button from '@/components/Button/Button';
import getCDNUrl from '@/utils/getCDNUrl';
import { BRAND, LOGOUT_ROUTE } from '@/global-vars';
import PromoBanner from '@/offers/components/PromoBanner/PromoBanner';
import LoadingPlaceholder from '@/offers/components/LoadingSpinner/LoadingSpinner';
import CardCarousel from '@/offers/components/CardCarousel/CardCarousel';
import {
  BannerType,
  DealsOfTheWeekType,
  MarketPlaceMenuType,
  MarketPlaceItemType,
  FlexibleMenuType,
  FeaturedOffersType,
} from '@/page-types/members-home';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className = '', ...props }: ContainerProps) => {
  return (
    <>
      <div className={`${className} px-2 tablet:px-8 laptop:px-64 py-4 w-full`} {...props}>
        {children}
      </div>
      <hr />
    </>
  );
};

function cleanText(text: string) {
  return text
    .replace(/&nbsp;/g, ' ') // Might not matter, but just in case
    .replace(/&amp;/g, '&')
    .replace(/&pound;/g, '£');
}

const HomePage: NextPage<any> = (props) => {
  const { header, footer } = props;

  // Store data states
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [dealsOfTheWeek, setDealsOfTheWeek] = useState<DealsOfTheWeekType[]>([]);
  const [marketplaceMenus, setMarketplaceMenus] = useState<MarketPlaceMenuType[]>([]);
  const [flexibleMenu, setFlexibleMenu] = useState<FlexibleMenuType[]>([]);
  const [featuredOffers, setFeaturedOffers] = useState<FeaturedOffersType[]>([]);

  // Handle loading states
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  // Fetch Data on first load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryResponse = await makeQuery(homePageQuery(BRAND));

        setBanners(queryResponse.data.banners as BannerType[]);
        setDealsOfTheWeek(queryResponse.data.offerMenus.deals as DealsOfTheWeekType[]);
        setMarketplaceMenus(queryResponse.data.offerMenus.marketPlace as MarketPlaceMenuType[]);
        setFlexibleMenu(queryResponse.data.offerMenus.flexible as FlexibleMenuType[]);
        setFeaturedOffers(queryResponse.data.offerMenus.features as FeaturedOffersType[]);
        setLoadingError(false);
      } catch (error) {
        setLoadingError(true);
      }
      setHasLoaded(true);
    };

    fetchData();
  }, []);

  // Format carousel data
  const dealsOfTheWeekOffersData = dealsOfTheWeek.map((offer: DealsOfTheWeekType) => ({
    offername: cleanText(offer.offername),
    companyname: cleanText(offer.companyname),
    imageUrl: offer.image
      ? offer.image
      : getCDNUrl(`/companyimages/complarge/retina/${offer.logos}`),
    href: `/offerdetails.php?cid=${offer.compid}&oid=${offer.id}`,
  }));

  const flexibleOffersData = flexibleMenu
    .map((offer: FlexibleMenuType, index: number) => ({
      hide: offer.hide,
      offername: cleanText(offer.title),
      imageUrl: cleanText(offer.imagehome),
      href: `/flexibleOffers.php?id=${index}`,
    }))
    .filter((offer) => !offer.hide);

  const featuredOffersData = featuredOffers.map((offer: FeaturedOffersType) => ({
    companyname: cleanText(offer.companyname),
    offername: cleanText(offer.offername),
    href: `/offerdetails.php?cid=${offer.compid}&oid=${offer.id}`,
    imageUrl: offer.image
      ? offer.image
      : getCDNUrl(`/companyimages/complarge/retina/${offer.logos}`),
  }));

  return (
    <>
      <Header logoUrl={header.logoSource} navItems={header.navItems} loggedIn={true} />

      {!hasLoaded && <LoadingPlaceholder />}

      {loadingError && (
        <div className="w-full h-[400px] flex justify-center">
          <div className="m-auto">
            <Heading headingLevel={'h1'}>An error has occured when loading the page</Heading>
            <Link href={LOGOUT_ROUTE} useLegacyRouting={process.env.NODE_ENV === 'production'}>
              <Button>Please login again</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Banners Carousel */}
      {banners.length > 0 && (
        <Container data-testid="takeover-banners">
          <Carousel
            autoPlay
            showControls
            elementsPerPageLaptop={1}
            elementsPerPageDesktop={1}
            elementsPerPageTablet={1}
            elementsPerPageMobile={1}
          >
            {banners.map((banner: any, index: number) => (
              <PromoBanner
                key={index}
                image={banner.imageSource}
                href={banner.link}
                id={'promoBanner' + index}
              />
            ))}
          </Carousel>
        </Container>
      )}

      {/* Deals of the week carousel */}
      {dealsOfTheWeek.length > 0 && (
        <Container className="flex flex-col" data-testid="deals-carousel">
          <CardCarousel
            title="Deals of the week"
            itemsToShow={2}
            offers={dealsOfTheWeekOffersData}
          />
        </Container>
      )}

      {/* Flexible offers carousel */}
      {flexibleMenu.length > 0 && (
        <Container className="flex flex-col" data-testid="flexi-menu-carousel">
          <CardCarousel
            title={'Ways to Save'}
            itemsToShow={3}
            useSmallCards
            offers={flexibleOffersData}
          />
        </Container>
      )}

      {/* Marketplace carousels */}
      {marketplaceMenus.map((menu: MarketPlaceMenuType, index: number) => {
        return (
          <Container key={index} data-testid="marketplace-menu-carousel">
            <CardCarousel
              title={menu.name}
              itemsToShow={3}
              offers={menu.items.map(({ item }: MarketPlaceItemType) => {
                return {
                  offername: cleanText(item.offername),
                  companyname: cleanText(item.companyname),
                  imageUrl: item.image,
                  href: `/offerdetails.php?cid=${item.compid}&oid=${item.id}`,
                };
              })}
            />
          </Container>
        );
      })}

      {/* Featured offers carousel */}
      {featuredOffers.length > 0 && (
        <Container className="flex flex-col" data-testid="featured-menu-carousel">
          <CardCarousel title="Featured Offers" itemsToShow={3} offers={featuredOffersData} />
        </Container>
      )}

      <Footer {...footer} />
    </>
  );
};

export async function getStaticProps(context: any) {
  // Pull in the dummy data for footer and header
  return {
    props: {
      header: headerConfig,
      footer: footerConfig.footer,
    },
  };
}

export default withAuth(HomePage);

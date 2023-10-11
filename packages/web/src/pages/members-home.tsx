import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import headerConfig from '@/data/header.json';
import footerConfig from '@/data/footer.json';
import Header from '@/components/Header/Header';
import Heading from '@/components/Heading/Heading';
import Carousel from '@/components/Carousel/Carousel';
import Footer from '@/components/Footer/Footer';
import withAuth from '@/hoc/withAuth';
import { homePageQuery } from '../graphql/homePageQueries';
import makeQuery from '../graphql/makeQuery';
import Link from '@/components/Link/Link';
import Button from '@/components/Button/Button';
import getCDNUrl from '@/utils/getCDNUrl';
import { BRAND, LOGOUT_ROUTE } from '@/global-vars';
import PromoBanner from '@/offers/components/PromoBanner/PromoBanner';
import CardCarousel from '@/offers/components/CardCarousel/CardCarousel';
import {
  BannerType,
  DealsOfTheWeekType,
  MarketPlaceMenuType,
  MarketPlaceItemType,
  FlexibleMenuType,
  FeaturedOffersType,
} from '@/page-types/members-home';

import {
  logMembersHomePage,
  logSearchCompanyEvent,
  logSearchCategoryEvent,
  logSearchTermEvent,
} from '@/utils/amplitude';
import PromoBannerPlaceholder from '@/offers/components/PromoBanner/PromoBannerPlaceholder';
import StandardPadding from '@/components/StandardPadding/StandardPadding';
import AlertBox from '@/components/AlertBox/AlertBox';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className = '', ...props }: ContainerProps) => {
  return (
    <>
      <StandardPadding className={`py-10 ${className}`} {...props}>
        {children}
      </StandardPadding>
      <hr className="" />
    </>
  );
};

function cleanText(text: string) {
  return text
    .replace(/&nbsp;/g, ' ') // Might not matter, but just in case
    .replace(/&amp;/g, '&')
    .replace(/&pound;/g, '£');
}

const onSearchCompanyChange = (companyId: string, company: string) => {
  logSearchCompanyEvent(companyId, company);
  window.location.href = `/offerdetails.php?cid=${companyId}`;
};

const onSearchCategoryChange = (categoryId: string, categoryName: string) => {
  logSearchCategoryEvent(categoryId, categoryName);
  window.location.href = `/offers.php?cat=true&type=${categoryId}`;
};

const onSearchTerm = (searchTerm: string) => {
  logSearchTermEvent(searchTerm);
  window.location.href = `/offers.php?type=1&opensearch=1&search=${searchTerm}`;
};

const HomePage: NextPage<any> = (props) => {
  const { header, footer } = props;

  // Store data states
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [dealsOfTheWeek, setDealsOfTheWeek] = useState<DealsOfTheWeekType[]>([]);
  const [marketplaceMenus, setMarketplaceMenus] = useState<MarketPlaceMenuType[]>([]);
  const [flexibleMenu, setFlexibleMenu] = useState<FlexibleMenuType[]>([]);
  const [featuredOffers, setFeaturedOffers] = useState<FeaturedOffersType[]>([]);

  // Handle loading states
  const [loadingError, setLoadingError] = useState(false);

  // Fetch Data on first load
  useEffect(() => {
    logMembersHomePage();
    const fetchData = async () => {
      try {
        const homePageQueryPromise = makeQuery(homePageQuery(BRAND));
        const homePageQueryResponse = await homePageQueryPromise;

        setBanners(homePageQueryResponse.data.banners as BannerType[]);
        setDealsOfTheWeek(homePageQueryResponse.data.offerMenus.deals as DealsOfTheWeekType[]);
        setMarketplaceMenus(
          homePageQueryResponse.data.offerMenus.marketPlace as MarketPlaceMenuType[]
        );
        setFlexibleMenu(homePageQueryResponse.data.offerMenus.flexible as FlexibleMenuType[]);
        setFeaturedOffers(homePageQueryResponse.data.offerMenus.features as FeaturedOffersType[]);
        setLoadingError(false);
      } catch (error) {
        setLoadingError(true);
      }
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
      <Header
        navItems={header.navItems}
        loggedIn={true}
        onSearchCompanyChange={onSearchCompanyChange}
        onSearchCategoryChange={onSearchCategoryChange}
        onSearchTerm={onSearchTerm}
      />

      {loadingError && (
        <AlertBox
          alertType="danger"
          title="Error:"
          description="An error has occured when loading the page. Please try again."
        />
      )}

      {/* Promo banner carousel */}
      <Container data-testid="takeover-banners">
        <Carousel
          autoPlay
          showControls
          elementsPerPageLaptop={1}
          elementsPerPageDesktop={1}
          elementsPerPageTablet={1}
          elementsPerPageMobile={1}
        >
          {banners.length > 0 ? (
            banners.map((banner: any, index: number) => (
              <PromoBanner
                key={index}
                image={banner.imageSource}
                href={banner.link}
                id={'promoBanner' + index}
              />
            ))
          ) : (
            <PromoBannerPlaceholder />
          )}
        </Carousel>
      </Container>

      {/* Deals of the week carousel */}

      <Container
        className="flex flex-col bg-surface-secondary-light dark:bg-surface-secondary-dark"
        data-testid="deals-carousel"
      >
        <CardCarousel title="Deals of the week" itemsToShow={2} offers={dealsOfTheWeekOffersData} />
      </Container>

      {/* Flexible offers carousel */}
      <Container
        className="flex flex-col bg-surface-secondary-light dark:bg-surface-secondary-dark"
        data-testid="flexi-menu-carousel"
      >
        <CardCarousel
          title={'Ways to Save'}
          itemsToShow={3}
          useSmallCards
          offers={flexibleOffersData}
        />
      </Container>

      {/* Marketplace carousels */}
      {marketplaceMenus.map((menu: MarketPlaceMenuType, index: number) => {
        return (
          <Container
            className="bg-surface-secondary-light dark:bg-surface-secondary-dark"
            key={index}
            data-testid="marketplace-menu-carousel"
          >
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
      <Container
        className="flex flex-col bg-surface-secondary-light dark:bg-surface-secondary-dark"
        data-testid="featured-menu-carousel"
      >
        <CardCarousel title="Featured Offers" itemsToShow={3} offers={featuredOffersData} />
      </Container>

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

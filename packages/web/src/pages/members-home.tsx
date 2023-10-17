import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import withAuth from '@/hoc/withAuth';
import { homePageQuery } from '../graphql/homePageQueries';
import makeQuery from '../graphql/makeQuery';
import getCDNUrl from '@/utils/getCDNUrl';
import { BRAND } from '@/global-vars';
import PromoBanner from '@/offers/components/PromoBanner/PromoBanner';
import CardCarousel from '@/offers/components/CardCarousel/CardCarousel';
import {
  BannerType,
  DealsOfTheWeekType,
  FeaturedOffersType,
  FlexibleMenuType,
  MarketPlaceItemType,
  MarketPlaceMenuType,
} from '@/page-types/members-home';
import { logMembersHomePage } from '@/utils/amplitude';
import PromoBannerPlaceholder from '@/offers/components/PromoBanner/PromoBannerPlaceholder';
import AlertBox from '@/components/AlertBox/AlertBox';
import { NextPage } from 'next';
import Container from '@/components/Container/Container';
import SwiperCarousel from '@/components/SwiperCarousel/SwiperCarousel';

function cleanText(text: string) {
  return text
    .replace(/&nbsp;/g, ' ') // Might not matter, but just in case
    .replace(/&amp;/g, '&')
    .replace(/&pound;/g, '£');
}

const HomePage: NextPage<any> = () => {
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

        const slicedBanners = shuffle(homePageQueryResponse.data.banners).slice(0, 3);

        setBanners(slicedBanners as BannerType[]);
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
      {loadingError && (
        <Container className="pt-5" addBottomHorizontalLine={false}>
          <AlertBox
            alertType="danger"
            title="Error:"
            description="An error has occurred. Try again."
          />
        </Container>
      )}

      {/* Promo banner carousel */}
      <Container className="py-5" data-testid="homepage-sponsor-banners" addBottomHorizontalLine>
        <SwiperCarousel
          autoPlay
          elementsPerPageLaptop={1}
          elementsPerPageDesktop={1}
          elementsPerPageTablet={1}
          elementsPerPageMobile={1}
          hidePillButtons
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
        </SwiperCarousel>
      </Container>

      {/* Deals of the week carousel */}

      <Container
        className="flex flex-col py-10 bg-surface-secondary-light dark:bg-surface-secondary-dark"
        addBottomHorizontalLine
        data-testid="deals-carousel"
      >
        <CardCarousel title="Deals of the week" itemsToShow={2} offers={dealsOfTheWeekOffersData} />
      </Container>

      {/* Flexible offers carousel */}
      <Container
        className="flex flex-col py-10 bg-surface-secondary-light dark:bg-surface-secondary-dark"
        addBottomHorizontalLine
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
            className="py-10 bg-surface-secondary-light dark:bg-surface-secondary-dark"
            addBottomHorizontalLine
            key={index}
            data-testid={`marketplace-menu-carousel-${index}`}
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
        className="flex flex-col py-10 bg-surface-secondary-light dark:bg-surface-secondary-dark"
        addBottomHorizontalLine
        data-testid="featured-menu-carousel"
      >
        <CardCarousel title="Featured Offers" itemsToShow={3} offers={featuredOffersData} />
      </Container>
    </>
  );
};

export default withAuth(HomePage);

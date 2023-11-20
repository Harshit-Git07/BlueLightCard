import React, { useContext, useEffect, useState } from 'react';
import withAuth from '@/hoc/withAuth';
import { homePageQuery } from '../graphql/homePageQueries';
import { makeHomePageQueryWithDislikeRestrictions } from '../graphql/makeQuery';
import getCDNUrl from '@/utils/getCDNUrl';

import {
  BLACK_FRIDAY_TIME_LOCK_START_DATE,
  BLACK_FRIDAY_TIME_LOCK_END_DATE,
  BRAND,
} from '@/global-vars';
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
import Container from '@/components/Container/Container';
import SwiperCarousel from '@/components/SwiperCarousel/SwiperCarousel';
import withLayout from '@/hoc/withLayout';
import { NextPage } from 'next';
import getI18nStaticProps from '@/utils/i18nStaticProps';

import inTimePeriod from '@/utils/inTimePeriod';
import { shuffle } from 'lodash';
import AuthContext from '@/context/Auth/AuthContext';
import UserContext from '@/context/User/UserContext';

const BLACK_FRIDAY_TIMELOCK_SETTINGS = {
  startTime: BLACK_FRIDAY_TIME_LOCK_START_DATE,
  endTime: BLACK_FRIDAY_TIME_LOCK_END_DATE,
};

function cleanText(text: string) {
  return text
    .replace(/&nbsp;/g, ' ') // Might not matter, but just in case
    .replace(/&amp;/g, '&')
    .replace(/&pound;/g, '£');
}

const finalFallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);

function handleImageFallbacks(
  primaryImage: string | undefined,
  secondaryImage: string | undefined
) {
  if (primaryImage && primaryImage !== '') return primaryImage;

  if (secondaryImage && secondaryImage !== '')
    return getCDNUrl(`/companyimages/complarge/retina/${secondaryImage}`);

  return finalFallbackImage;
}

const HomePage: NextPage<any> = () => {
  // Store data states
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [dealsOfTheWeek, setDealsOfTheWeek] = useState<DealsOfTheWeekType[]>([]);
  const [marketplaceMenus, setMarketplaceMenus] = useState<MarketPlaceMenuType[]>([]);
  const [flexibleMenu, setFlexibleMenu] = useState<FlexibleMenuType[]>([]);
  const [featuredOffers, setFeaturedOffers] = useState<FeaturedOffersType[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Handle loading states
  const [loadingError, setLoadingError] = useState(false);

  // Auth context
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  // Fetch Data on first load
  useEffect(() => {
    logMembersHomePage();
    const fetchData = async () => {
      let user = userCtx.user;

      // Fetch home page data
      let homePage;

      try {
        const homePageData = await makeHomePageQueryWithDislikeRestrictions(
          homePageQuery(BRAND, userCtx.isAgeGated ?? true, user?.organisation ?? 'NHS'),
          userCtx.dislikes
        );
        homePage = homePageData.data;
      } catch (e) {
        setLoadingError(true);
        return;
      }
      const slicedBanners = shuffle(homePage.banners).slice(0, 3);

      setBanners(slicedBanners as BannerType[]);

      setDealsOfTheWeek(homePage.offerMenus?.deals as DealsOfTheWeekType[]);
      setMarketplaceMenus(homePage.offerMenus?.marketPlace as MarketPlaceMenuType[]);
      setFlexibleMenu(homePage.offerMenus?.flexible as FlexibleMenuType[]);
      setFeaturedOffers(homePage.offerMenus.features as FeaturedOffersType[]);
      setLoadingError(false);

      setHasLoaded(true);
    };

    if (userCtx.user || userCtx.error) {
      fetchData();
    }
  }, [
    authCtx.isReady,
    authCtx.authState.idToken,
    userCtx.user,
    userCtx.isAgeGated,
    userCtx.dislikes,
    userCtx.error,
  ]);

  // Format carousel data
  const dealsOfTheWeekOffersData = dealsOfTheWeek.map((offer: DealsOfTheWeekType) => ({
    offername: cleanText(offer.offername),
    companyname: cleanText(offer.companyname),
    imageUrl: handleImageFallbacks(offer.image, offer.logos),
    href: `/offerdetails.php?cid=${offer.compid}&oid=${offer.id}`,
  }));

  const flexibleOffersData = flexibleMenu
    .map((offer: FlexibleMenuType, index: number) => ({
      hide: offer.hide,
      offername: cleanText(offer.title),
      imageUrl: offer.imagehome ? offer.imagehome : finalFallbackImage,
      href: `/flexibleOffers.php?id=${index}`,
    }))
    .filter((offer) => !offer.hide);

  const featuredOffersData = featuredOffers.map((offer: FeaturedOffersType) => ({
    companyname: cleanText(offer.companyname),
    offername: cleanText(offer.offername),
    href: `/offerdetails.php?cid=${offer.compid}&oid=${offer.id}`,
    imageUrl: handleImageFallbacks(offer.image, offer.logos),
  }));

  const isBlackFriday = inTimePeriod(BLACK_FRIDAY_TIMELOCK_SETTINGS);
  const flexibleMenuTitle = isBlackFriday ? 'Shop Black Friday' : 'Ways to Save';

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
      {(banners.length > 0 || !hasLoaded) && (
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
      )}

      {/* Deals of the week carousel */}
      {(dealsOfTheWeekOffersData.length > 0 || !hasLoaded) && (
        <Container
          className="flex flex-col py-10 bg-surface-secondary-light dark:bg-surface-secondary-dark"
          addBottomHorizontalLine
          data-testid="deals-carousel"
        >
          <CardCarousel
            title="Deals of the week"
            itemsToShow={2}
            offers={dealsOfTheWeekOffersData}
          />
        </Container>
      )}

      {/* Flexible offers carousel */}
      {(flexibleOffersData.length > 0 || !hasLoaded) && (
        <Container
          className="flex flex-col py-10 bg-surface-secondary-light dark:bg-surface-secondary-dark"
          addBottomHorizontalLine
          data-testid="flexi-menu-carousel"
        >
          <CardCarousel
            title={flexibleMenuTitle}
            itemsToShow={3}
            useSmallCards
            offers={flexibleOffersData}
          />
        </Container>
      )}

      {/* Marketplace carousels */}
      {marketplaceMenus.map((menu: MarketPlaceMenuType, index: number) => {
        if (menu.items.length === 0 || menu.hidden) return <></>;
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
                  imageUrl: handleImageFallbacks(item.image, item.logos),
                  href: `/offerdetails.php?cid=${item.compid}&oid=${item.offerId}`,
                };
              })}
            />
          </Container>
        );
      })}

      {/* Featured offers carousel */}
      {(featuredOffersData.length > 0 || !hasLoaded) && (
        <Container
          className="flex flex-col py-10 bg-surface-secondary-light dark:bg-surface-secondary-dark"
          addBottomHorizontalLine
          data-testid="featured-menu-carousel"
        >
          <CardCarousel title="Featured Offers" itemsToShow={3} offers={featuredOffersData} />
        </Container>
      )}
    </>
  );
};

export const getStaticProps = getI18nStaticProps;

const layoutProps = {
  seo: {
    title: 'offers.seo.title',
    description: 'offers.seo.description',
    keywords: 'offers.seo.keywords',
  },
};

export default withLayout(withAuth(HomePage), layoutProps);

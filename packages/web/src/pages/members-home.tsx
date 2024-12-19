import { useContext, useEffect } from 'react';
import getCDNUrl from '@/utils/getCDNUrl';
import { BLACK_FRIDAY_TIME_LOCK_END_DATE, BLACK_FRIDAY_TIME_LOCK_START_DATE } from '@/global-vars';
import PromoBanner from '@/offers/components/PromoBanner/PromoBanner';
import CardCarousel from '@/offers/components/CardCarousel/CardCarousel';
import {
  DealsOfTheWeekType,
  FeaturedOffersType,
  FlexibleMenuType,
  MarketPlaceItemType,
  MarketPlaceMenuType,
} from '@/page-types/members-home';
import {
  logMembersHomePage,
  trackHomepageCarouselClick,
  trackHomepageCarouselInteraction,
  trackTenancyClick,
} from '@/utils/amplitude';
import PromoBannerPlaceholder from '@/offers/components/PromoBanner/PromoBannerPlaceholder';
import AlertBox from '@/components/AlertBox/AlertBox';
import Container from '@/components/Container/Container';
import {
  Button,
  PlatformVariant,
  SwiperCarousel,
  useOfferDetails,
  usePlatformAdapter,
} from '@bluelightcard/shared-ui';
import { NextPage } from 'next';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import inTimePeriod from '@/utils/inTimePeriod';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import AmplitudeContext from '../common/context/AmplitudeContext';
import { useMedia } from 'react-use';
import TenancyBanner from '../common/components/TenancyBanner';
import useFetchHomepageData from '@/hooks/useFetchHomepageData';
import { useShowRenewalModal } from '@/root/src/member-eligibility/hooks/UseShowRenewalModal';
import { RenewalModal } from '@/root/src/member-eligibility/renewal/modal/RenewalModal';

const BLACK_FRIDAY_TIMELOCK_SETTINGS = {
  startTime: BLACK_FRIDAY_TIME_LOCK_START_DATE,
  endTime: BLACK_FRIDAY_TIME_LOCK_END_DATE,
};

function cleanText(text: string | null | undefined) {
  if (!text) return ''; // Return an empty string if the text is null or undefined
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&pound;/g, '£');
}

const finalFallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);

function handleImageFallbacks(
  primaryImage: string | undefined,
  secondaryImage: string | undefined
) {
  if (primaryImage && primaryImage !== '') return primaryImage;

  if (secondaryImage && secondaryImage !== '') {
    return getCDNUrl(`/companyimages/complarge/retina/${secondaryImage}`);
  }

  return finalFallbackImage;
}

const HomePage: NextPage<any> = () => {
  const { viewOffer } = useOfferDetails();

  const isMobile = useMedia('(max-width: 500px)');

  const brazeContentCardsEnabled = useAmplitudeExperiment(
    AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED,
    'control'
  );
  const modernFlexiMenusFlag = useAmplitudeExperiment(
    AmplitudeExperimentFlags.MODERN_FLEXI_MENUS,
    'off'
  );

  const amplitude = useContext(AmplitudeContext);

  const { shouldShowRenewalModal, onHideRenewalModal, ifCardExpiredMoreThan30Days } =
    useShowRenewalModal();

  // TODO: Disabled due to Friday code freeze
  // useEligibilityRedirector();

  const {
    banners,
    dealsOfTheWeek,
    featuredOffers,
    marketplaceMenus,
    flexibleMenu,
    hasLoaded,
    loadingError,
  } = useFetchHomepageData();

  useEffect(() => {
    logMembersHomePage();
  }, []);

  async function onSelectOffer(
    offerId: number | string,
    companyId: number | string,
    companyName: string
  ) {
    await viewOffer({
      offerId: offerId,
      companyId: companyId,
      companyName: companyName,
      platform: PlatformVariant.Web,
      amplitudeCtx: amplitude,
      responsiveWeb: isMobile,
    });
  }

  // Format carousel data

  const dealsOfTheWeekOffersData = dealsOfTheWeek.map((offer: DealsOfTheWeekType) => ({
    offername: cleanText(offer.offername),
    companyname: cleanText(offer.companyname),
    imageUrl: handleImageFallbacks(offer.image, offer.logos),
    href: `/offerdetails.php?cid=${offer.compid}&oid=${offer.id}`,
    offerId: offer.id,
    companyId: offer.compid,
    hasLink: false,
    onClick: () => {
      trackHomepageCarouselClick(
        'deals_of_the_week',
        'Deals of the Week',
        offer.id,
        offer.compid,
        offer.companyname
      );
      onSelectOffer(offer.id, offer.compid, offer.companyname);
    },
  }));

  const flexibleOffersData = flexibleMenu
    .map((offer: FlexibleMenuType, index: number) => ({
      hide: offer.hide,
      offername: cleanText(offer.title),
      imageUrl: offer.imagehome ? offer.imagehome : finalFallbackImage,
      href:
        modernFlexiMenusFlag.data?.variantName === 'on' && offer.id
          ? `/flexible-offers?id=${offer.id}`
          : `/flexibleOffers.php?id=${index}`,
    }))
    .filter((offer) => !offer.hide);

  const featuredOffersData = featuredOffers.map((offer: FeaturedOffersType) => ({
    companyname: cleanText(offer.companyname),
    offername: cleanText(offer.offername),
    href: `/offerdetails.php?cid=${offer.compid}&oid=${offer.id}`,
    imageUrl: handleImageFallbacks(offer.image, offer.logos),
    offerId: offer.id,
    companyId: offer.compid,
    hasLink: false,
    onClick: () => {
      trackHomepageCarouselClick(
        'featured_offers',
        'Featured Offers',
        offer.id,
        offer.compid,
        offer.companyname
      );
      onSelectOffer(offer.id, offer.compid, offer.companyname);
    },
    onInteracted: () => {
      trackHomepageCarouselInteraction('featured_offers', 'Featured Offers');
    },
  }));

  const isBlackFriday = inTimePeriod(BLACK_FRIDAY_TIMELOCK_SETTINGS);
  const flexibleMenuTitle = isBlackFriday ? 'Shop Black Friday' : 'Ways to Save';

  return (
    <>
      {shouldShowRenewalModal && (
        <RenewalModal
          data-testid="renewal-modal"
          ifCardExpiredMoreThan30Days={ifCardExpiredMoreThan30Days}
          onClose={onHideRenewalModal}
        />
      )}

      {loadingError && (
        <Container className="pt-5" addBottomHorizontalLine={false}>
          <AlertBox
            alertType="danger"
            title="Error:"
            description="An error has occurred. Try again."
          />
        </Container>
      )}

      {/* Promo banner placeholder while experiment value is loading */}
      {brazeContentCardsEnabled.status === 'pending' && (
        <Container
          className="py-5"
          data-testid="tenancy-banner-experiment-placeholder"
          addBottomHorizontalLine
        >
          <PromoBannerPlaceholder />
        </Container>
      )}

      {/* Promo banner carousel */}
      {brazeContentCardsEnabled.data?.variantName === 'control' &&
        (banners.length > 0 || !hasLoaded) && (
          <Container
            className="py-5"
            data-testid="homepage-sponsor-banners"
            addBottomHorizontalLine
          >
            <SwiperCarousel
              elementsPerPageLaptop={1}
              elementsPerPageDesktop={1}
              elementsPerPageTablet={1}
              elementsPerPageMobile={1}
              navigation
            >
              {banners.length > 0 ? (
                banners.map((banner: any, index: number) => (
                  <PromoBanner
                    key={index}
                    image={banner.imageSource}
                    href={banner.link}
                    id={'promoBanner' + index}
                    onClick={() => trackTenancyClick('homepage_sponsor_banner', banner.link)}
                  />
                ))
              ) : (
                <PromoBannerPlaceholder />
              )}
            </SwiperCarousel>
          </Container>
        )}

      {/* Braze tenancy banner carousel */}
      {brazeContentCardsEnabled.data?.variantName === 'treatment' && (
        <Container className="py-5" data-testid="braze-tenancy-banner" addBottomHorizontalLine>
          <TenancyBanner title="homepage_sponsor_banner" variant="large" />
        </Container>
      )}

      {usePlatformAdapter().getAmplitudeFeatureFlag(AmplitudeExperimentFlags.BLT_TICKET_SHEET) ===
        'on' && (
        <Button
          onClick={async () => {
            await onSelectOffer('cb0db35f-c3b3-44bf-bb67-4295bd0c11a7', '', 'Ticket');
          }}
        >
          BLT Test
        </Button>
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
            onCarouselInteracted={() => {
              trackHomepageCarouselInteraction('deals_of_the_week', 'Deals of the Week');
            }}
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
            offers={flexibleOffersData}
            useSmallCards
            onCarouselInteracted={() => {
              trackHomepageCarouselInteraction('flexi_menu', flexibleMenuTitle);
            }}
          />
        </Container>
      )}

      {/* Marketplace carousels */}
      {marketplaceMenus.length > 0 &&
        marketplaceMenus.map((menu: MarketPlaceMenuType, index: number) => {
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
                    offerId: item.offerId,
                    companyId: item.compid,
                    hasLink: false,
                    onClick: async () => {
                      await onSelectOffer(item.offerId, item.compid, item.companyname);
                      trackHomepageCarouselClick(
                        'marketplace_menu',
                        menu.name,
                        item.offerId,
                        item.compid,
                        cleanText(item.companyname)
                      );
                    },
                  };
                })}
                onCarouselInteracted={() => {
                  trackHomepageCarouselInteraction('marketplace_menu', menu.name);
                }}
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
          <CardCarousel
            title="Featured Offers"
            itemsToShow={3}
            offers={featuredOffersData}
            onCarouselInteracted={() => {
              trackHomepageCarouselInteraction('featured_offers', 'Featured Offers');
            }}
          />
        </Container>
      )}
    </>
  );
};

export const getStaticProps = getI18nStaticProps;

const layoutProps = {
  seo: {
    title: 'offers.members-home.title',
    description: 'offers.members-home.description',
    keywords: 'offers.members-home.keywords',
  },
};

export default withAuthProviderLayout(HomePage, layoutProps);
